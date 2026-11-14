import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { isNeonUserAdmin } from "./admins";
import { env } from "./env";
import { fetchNeonJwt } from "./neon-auth-bff";
import {
  readAdminJwt,
  readAdminSid,
  setAdminSessionCookies,
} from "./session-cookie";

export type AuthUser = {
  userId: string;
  email: string | null;
};

export type AuthVariables = {
  authUser: AuthUser;
};

type JwtClaims = JWTPayload & {
  email?: string;
  sub?: string;
};

const jwks = createRemoteJWKSet(new URL(env.neonAuthJwksUrl));
const authOrigin = new URL(env.neonAuthBaseUrl).origin;

export async function verifyNeonAccessToken(
  token: string
): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      algorithms: ["EdDSA"],
      issuer: authOrigin,
      audience: authOrigin,
    });

    const claims = payload as JwtClaims;
    if (!claims.sub) return null;

    return {
      userId: claims.sub,
      email: typeof claims.email === "string" ? claims.email : null,
    };
  } catch {
    return null;
  }
}

function bearerToken(c: Context): string | null {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

/**
 * Resolve a valid JWT for this request.
 * Prefer Authorization Bearer, then the BFF cookie; refresh from Neon
 * session cookie when the short-lived JWT has expired.
 */
export async function resolveAccessToken(
  c: Context
): Promise<string | null> {
  const bearer = bearerToken(c);
  if (bearer) {
    const user = await verifyNeonAccessToken(bearer);
    if (user) return bearer;
  }

  const cookieJwt = readAdminJwt(c);
  if (cookieJwt) {
    const user = await verifyNeonAccessToken(cookieJwt);
    if (user) return cookieJwt;
  }

  const sid = readAdminSid(c);
  if (!sid) return null;

  const refreshed = await fetchNeonJwt(sid);
  if (!refreshed) return null;

  const user = await verifyNeonAccessToken(refreshed);
  if (!user) return null;

  setAdminSessionCookies(c, {
    jwt: refreshed,
    neonSessionToken: sid,
  });

  return refreshed;
}

/** Require a valid Neon Auth JWT whose user has the admin role. */
export async function requireAuth(
  c: Context<{ Variables: AuthVariables }>,
  next: Next
) {
  const token = await resolveAccessToken(c);
  if (!token) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  const user = await verifyNeonAccessToken(token);
  if (!user) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  const isAdmin = await isNeonUserAdmin(user.userId);
  if (!isAdmin) {
    return c.json({ ok: false, error: "Forbidden" }, 403);
  }

  c.set("authUser", user);
  await next();
}
