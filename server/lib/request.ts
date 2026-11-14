import type { Context } from "hono";

export function clientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return c.req.header("x-real-ip") || "unknown";
}

export function clientUserAgent(c: Context): string {
  return (c.req.header("user-agent") || "").slice(0, 512);
}
