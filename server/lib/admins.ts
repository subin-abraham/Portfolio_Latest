import { sql } from "drizzle-orm";
import { getDb } from "../../src/db/client";

type NeonRowResult = { rows?: Array<Record<string, unknown>> };

function rowsOf(result: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(result)) return result as Array<Record<string, unknown>>;
  const rows = (result as NeonRowResult)?.rows;
  return Array.isArray(rows) ? rows : [];
}

function hasAdminRole(role: unknown): boolean {
  if (typeof role !== "string" || !role.trim()) return false;
  return role
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .includes("admin");
}

/** Promote a Neon Auth user to admin (portfolio control-panel role). */
export async function promoteNeonUserToAdmin(userId: string): Promise<void> {
  const db = getDb();
  await db.execute(sql`
    update neon_auth."user"
    set role = 'admin', "updatedAt" = now()
    where id = ${userId}::uuid
  `);
}

export async function isNeonUserAdmin(userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute(sql`
    select role
    from neon_auth."user"
    where id = ${userId}::uuid
    limit 1
  `);

  const row = rowsOf(result)[0];
  return hasAdminRole(row?.role);
}
