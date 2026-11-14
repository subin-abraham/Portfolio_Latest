import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { env } from "./env";

/** HttpOnly JWT used by admin APIs (never exposed to JS). */
export const ADMIN_JWT_COOKIE = "portfolio_admin_token";

/** Neon Auth session token — server-only, used to revoke on logout. */
export const ADMIN_SID_COOKIE = "portfolio_admin_sid";

const WEEK_SEC = 60 * 60 * 24 * 7;

function cookieOpts(maxAge = WEEK_SEC) {
  return {
    path: "/",
    httpOnly: true,
    secure: env.isProd,
    sameSite: "Lax" as const,
    maxAge,
  };
}

export function readAdminJwt(c: Context): string | undefined {
  return getCookie(c, ADMIN_JWT_COOKIE)?.trim() || undefined;
}

export function readAdminSid(c: Context): string | undefined {
  return getCookie(c, ADMIN_SID_COOKIE)?.trim() || undefined;
}

export function setAdminSessionCookies(
  c: Context,
  opts: { jwt: string; neonSessionToken: string; maxAgeSec?: number }
) {
  const maxAge = opts.maxAgeSec ?? WEEK_SEC;
  setCookie(c, ADMIN_JWT_COOKIE, opts.jwt, cookieOpts(maxAge));
  setCookie(c, ADMIN_SID_COOKIE, opts.neonSessionToken, cookieOpts(maxAge));
}

export function clearAdminSessionCookies(c: Context) {
  deleteCookie(c, ADMIN_JWT_COOKIE, { path: "/" });
  deleteCookie(c, ADMIN_SID_COOKIE, { path: "/" });
}
