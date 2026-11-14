import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { aboutStats } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody, uniqueOrFail } from "../lib/http";
import {
  createAboutStatSchema,
  updateAboutStatSchema,
} from "../lib/validation";

export const aboutStatsRoutes = new Hono<{ Variables: AuthVariables }>();

aboutStatsRoutes.get("/", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(aboutStats)
      .where(eq(aboutStats.isActive, true))
      .orderBy(asc(aboutStats.sortOrder), asc(aboutStats.title));
    return c.json({ ok: true, aboutStats: rows });
  } catch (error) {
    console.error("[about-stats/list]", error);
    return c.json({ ok: false, error: "Failed to load about stats" }, 500);
  }
});

aboutStatsRoutes.use("/admin/*", requireAuth);
aboutStatsRoutes.use("/admin", requireAuth);

aboutStatsRoutes.get("/admin", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(aboutStats)
      .orderBy(asc(aboutStats.sortOrder), asc(aboutStats.title));
    return c.json({ ok: true, aboutStats: rows });
  } catch (error) {
    console.error("[about-stats/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load about stats" }, 500);
  }
});

aboutStatsRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createAboutStatSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const [row] = await db.insert(aboutStats).values(parsed.data).returning();
    return c.json({ ok: true, aboutStat: row }, 201);
  } catch (error) {
    console.error("[about-stats/create]", error);
    return c.json({ ok: false, error: "Failed to create about stat" }, 400);
  }
});

aboutStatsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateAboutStatSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const [row] = await db
      .update(aboutStats)
      .set({ ...parsed.data, updatedAt: sql`now()` })
      .where(eq(aboutStats.id, id))
      .returning();
    if (!row) return c.json({ ok: false, error: "About stat not found" }, 404);
    return c.json({ ok: true, aboutStat: row });
  } catch (error) {
    console.error("[about-stats/update]", error);
    return c.json({ ok: false, error: "Failed to update about stat" }, 400);
  }
});

aboutStatsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(aboutStats)
      .where(eq(aboutStats.id, id))
      .returning({ id: aboutStats.id });
    if (!row) return c.json({ ok: false, error: "About stat not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[about-stats/delete]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "Cannot delete",
          "Failed to delete about stat"
        ),
      },
      500
    );
  }
});
