import { env } from "./env";

const authBase = () => env.neonAuthBaseUrl.replace(/\/$/, "");

export type NeonSignInResult =
  | {
      ok: true;
      user: { id: string; email: string; name: string; role: string | null };
      neonSessionToken: string;
      jwt: string;
    }
  | { ok: false; status: number; error: string };

type NeonUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string | null;
};

function neonErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as {
    message?: string;
    code?: string;
    error?: { message?: string } | string;
  };
  if (typeof record.error === "object" && record.error?.message) {
    return record.error.message;
  }
  if (typeof record.error === "string") return record.error;
  if (typeof record.message === "string") return record.message;
  return fallback;
}

function parseSessionTokenFromCookies(cookies: string[]): string | null {
  for (const raw of cookies) {
    const part = raw.split(";")[0] ?? "";
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (
      name === "__Secure-neon-auth.session_token" ||
      name === "neon-auth.session_token" ||
      name.endsWith("session_token")
    ) {
      return value || null;
    }
  }
  return null;
}

/** Exchange a Neon Auth session token for a short-lived JWT. */
export async function fetchNeonJwt(
  neonSessionToken: string
): Promise<string | null> {
  const res = await fetch(`${authBase()}/token`, {
    method: "GET",
    headers: {
      Cookie: `__Secure-neon-auth.session_token=${neonSessionToken}`,
      Origin: env.appOrigin,
    },
  });

  if (!res.ok) return null;
  const json = (await res.json().catch(() => ({}))) as { token?: string };
  return typeof json.token === "string" && json.token.length > 0
    ? json.token
    : null;
}

/**
 * Server-side Neon Auth email sign-in. Browser never talks to Neon Auth.
 */
export async function neonSignInEmail(input: {
  email: string;
  password: string;
  userAgent?: string;
}): Promise<NeonSignInResult> {
  const res = await fetch(`${authBase()}/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: env.appOrigin,
      "User-Agent": input.userAgent || "portfolio-admin-api",
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    token?: string;
    user?: NeonUser;
    message?: string;
  };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status === 429 ? 429 : 401,
      error: neonErrorMessage(body, "Invalid email or password."),
    };
  }

  const cookies =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [];
  const neonSessionToken =
    parseSessionTokenFromCookies(cookies) ||
    (typeof body.token === "string" ? body.token : null);

  if (!neonSessionToken) {
    return {
      ok: false,
      status: 502,
      error: "Auth provider did not return a session.",
    };
  }

  const headerJwt = res.headers.get("set-auth-jwt");
  const jwt =
    (headerJwt && headerJwt.trim()) || (await fetchNeonJwt(neonSessionToken));

  if (!jwt) {
    return {
      ok: false,
      status: 502,
      error: "Auth provider did not return an access token.",
    };
  }

  const user = body.user;
  if (!user?.id || !user.email) {
    return {
      ok: false,
      status: 502,
      error: "Auth provider returned an incomplete user.",
    };
  }

  return {
    ok: true,
    neonSessionToken,
    jwt,
    user: {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0] || "Admin",
      role: user.role ?? null,
    },
  };
}

export async function neonSignOut(neonSessionToken: string): Promise<void> {
  try {
    await fetch(`${authBase()}/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: env.appOrigin,
        Cookie: `__Secure-neon-auth.session_token=${neonSessionToken}`,
      },
      body: "{}",
    });
  } catch (error) {
    console.warn("[neon-auth] sign-out failed", error);
  }
}
