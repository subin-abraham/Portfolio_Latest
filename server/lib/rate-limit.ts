import { eq, sql } from "drizzle-orm";
import { getDb } from "../../src/db/client";
import { authRateLimits } from "../../src/db/schema";
import { env } from "./env";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * DB-backed fixed window rate limiter.
 * Key should include route + IP (and optionally email).
 */
export async function consumeRateLimit(bucketKey: string): Promise<RateLimitResult> {
  const db = getDb();
  const now = new Date();
  const windowMs = env.rateLimitWindowMs;
  const max = env.rateLimitMax;

  try {
    const existing = await db.query.authRateLimits.findFirst({
      where: eq(authRateLimits.bucketKey, bucketKey),
    });

    if (!existing) {
      await db.insert(authRateLimits).values({
        bucketKey,
        hitCount: 1,
        windowStart: now,
        updatedAt: now,
      });
      return { allowed: true, remaining: max - 1, retryAfterSec: 0 };
    }

    const elapsed = now.getTime() - existing.windowStart.getTime();
    if (elapsed >= windowMs) {
      await db
        .update(authRateLimits)
        .set({ hitCount: 1, windowStart: now, updatedAt: now })
        .where(eq(authRateLimits.bucketKey, bucketKey));
      return { allowed: true, remaining: max - 1, retryAfterSec: 0 };
    }

    if (existing.hitCount >= max) {
      const retryAfterSec = Math.ceil((windowMs - elapsed) / 1000);
      return { allowed: false, remaining: 0, retryAfterSec };
    }

    await db
      .update(authRateLimits)
      .set({
        hitCount: sql`${authRateLimits.hitCount} + 1`,
        updatedAt: now,
      })
      .where(eq(authRateLimits.bucketKey, bucketKey));

    return {
      allowed: true,
      remaining: Math.max(0, max - existing.hitCount - 1),
      retryAfterSec: 0,
    };
  } catch (error) {
    // Table may not exist until sql/004_rate_limits.sql is applied.
    console.warn("[rate-limit] unavailable; allowing request", error);
    return { allowed: true, remaining: max, retryAfterSec: 0 };
  }
}
