import { Hono } from "hono";
import { z } from "zod";
import { isNeonUserAdmin, promoteNeonUserToAdmin } from "../lib/admins";
import {
  requireAuth,
  type AuthVariables,
  verifyNeonAccessToken,
} from "../lib/auth";
import { env } from "../lib/env";
import { parseBody, readJsonBody } from "../lib/http";
import { neonSignInEmail, neonSignOut } from "../lib/neon-auth-bff";
import { consumeRateLimit } from "../lib/rate-limit";
import { clientIp, clientUserAgent } from "../lib/request";
import {
  clearAdminSessionCookies,
  readAdminSid,
  setAdminSessionCookies,
} from "../lib/session-cookie";

/**
 * Auth BFF: browser talks only to /api/auth/*.
 * Neon Auth is called server-side; JWT lives in an httpOnly cookie.
 */
export const authRoutes = new Hono<{ Variables: AuthVariables }>();

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  website: z.string().max(200).optional().default(""),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(1).max(120).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

/** Public flag for the SPA — never a substitute for the POST gate. */
authRoutes.get("/registration", (c) =>
  c.json({ ok: true, enabled: env.enableAdminRegistration })
);

authRoutes.post("/login", async (c) => {
  const ip = clientIp(c);
  const limit = await consumeRateLimit(`auth:login:${ip}`);
  if (!limit.allowed) {
    c.header("Retry-After", String(limit.retryAfterSec));
    return c.json(
      { ok: false, error: "Too many attempts. Try again later." },
      429
    );
  }

  const raw = await readJsonBody(c);
  if (!raw.ok) return raw.response;

  const parsed = parseBody(c, credentialsSchema, raw.body);
  if (!parsed.ok) return parsed.response;

  const { email, password, website } = parsed.data;

  if (website.trim().length > 0) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return c.json({ ok: true });
  }

  try {
    const result = await neonSignInEmail({
      email,
      password,
      userAgent: clientUserAgent(c),
    });

    if (!result.ok) {
      return c.json({ ok: false, error: result.error }, result.status);
    }

    const isAdmin = await isNeonUserAdmin(result.user.id);
    if (!isAdmin) {
      await neonSignOut(result.neonSessionToken);
      return c.json({ ok: false, error: "Forbidden" }, 403);
    }

    setAdminSessionCookies(c, {
      jwt: result.jwt,
      neonSessionToken: result.neonSessionToken,
    });

    return c.json({
      ok: true,
      admin: {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.name,
      },
    });
  } catch (error) {
    console.error("[auth/login]", error);
    return c.json({ ok: false, error: "Sign-in service unavailable." }, 502);
  }
});

authRoutes.post("/logout", async (c) => {
  const sid = readAdminSid(c);
  clearAdminSessionCookies(c);
  if (sid) {
    await neonSignOut(sid);
  }
  return c.json({ ok: true });
});

/**
 * Bootstrap admin registration. When ENABLE_ADMIN_REGISTRATION is false,
 * responds 404 so the route looks absent.
 */
authRoutes.post("/register", async (c) => {
  if (!env.enableAdminRegistration) {
    return c.json({ ok: false, error: "Not found" }, 404);
  }

  const ip = clientIp(c);
  const limit = await consumeRateLimit(`auth:register:${ip}`);
  if (!limit.allowed) {
    c.header("Retry-After", String(limit.retryAfterSec));
    return c.json(
      { ok: false, error: "Too many attempts. Try again later." },
      429
    );
  }

  const raw = await readJsonBody(c);
  if (!raw.ok) return raw.response;

  const parsed = parseBody(c, registerSchema, raw.body);
  if (!parsed.ok) return parsed.response;

  const { email, password, name, website } = parsed.data;

  if (website.trim().length > 0) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return c.json({ ok: true });
  }

  const displayName = name?.trim() || email.split("@")[0] || "Admin";
  const signUpUrl = `${env.neonAuthBaseUrl.replace(/\/$/, "")}/sign-up/email`;

  try {
    const neonRes = await fetch(signUpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: env.appOrigin,
        "User-Agent": clientUserAgent(c) || "portfolio-admin-api",
      },
      body: JSON.stringify({
        email,
        password,
        name: displayName,
      }),
    });

    const neonJson = (await neonRes.json().catch(() => ({}))) as {
      message?: string;
      error?: { message?: string } | string;
      user?: { id?: string; email?: string };
    };

    if (!neonRes.ok) {
      const message =
        (typeof neonJson.error === "object" && neonJson.error?.message) ||
        (typeof neonJson.error === "string" ? neonJson.error : null) ||
        neonJson.message ||
        "Registration failed.";

      const status =
        neonRes.status === 400 || neonRes.status === 422
          ? 400
          : neonRes.status === 429
            ? 429
            : 502;

      return c.json({ ok: false, error: message }, status);
    }

    const userId = neonJson.user?.id;
    if (!userId) {
      return c.json(
        { ok: false, error: "Registration succeeded but user id was missing." },
        502
      );
    }

    try {
      await promoteNeonUserToAdmin(userId);
    } catch (error) {
      console.error("[auth/register] promote admin", error);
      return c.json(
        {
          ok: false,
          error:
            "Account created but admin role failed. Contact the site owner.",
        },
        502
      );
    }

    // Auto sign-in through the same BFF path (sets httpOnly cookies).
    const signedIn = await neonSignInEmail({
      email,
      password,
      userAgent: clientUserAgent(c),
    });

    if (signedIn.ok) {
      setAdminSessionCookies(c, {
        jwt: signedIn.jwt,
        neonSessionToken: signedIn.neonSessionToken,
      });
    }

    return c.json({
      ok: true,
      admin: true,
      signedIn: signedIn.ok,
      user: {
        id: userId,
        email: neonJson.user?.email ?? email,
        name: displayName,
      },
    });
  } catch (error) {
    console.error("[auth/register]", error);
    return c.json(
      { ok: false, error: "Registration service unavailable." },
      502
    );
  }
});

/** Current admin from cookie / Bearer JWT. */
authRoutes.get("/me", requireAuth, async (c) => {
  const user = c.get("authUser");
  return c.json({
    ok: true,
    admin: {
      id: user.userId,
      email: user.email ?? "",
      displayName: user.email?.split("@")[0] ?? "Admin",
    },
  });
});

/** Optional: validate a token without requiring middleware on the client. */
authRoutes.post("/verify", async (c) => {
  let body: { token?: string } = {};
  try {
    body = (await c.req.json()) as { token?: string };
  } catch {
    return c.json({ ok: false, error: "Invalid request body." }, 400);
  }

  const token = body.token?.trim();
  if (!token) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  const user = await verifyNeonAccessToken(token);
  if (!user) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  return c.json({ ok: true, user });
});
