import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Pooled Neon HTTP driver for serverless / short-lived API requests.
 * Prefer DATABASE_URL (pooler). Use DATABASE_URL_UNPOOLED for migrations.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("USER:PASSWORD")) {
    throw new Error(
      "DATABASE_URL is not configured. Run `neon deploy` or `neon env pull`."
    );
  }

  if (!cached) {
    const sql = neon(url);
    cached = drizzle(sql, { schema });
  }

  return cached;
}

export type Db = ReturnType<typeof getDb>;
