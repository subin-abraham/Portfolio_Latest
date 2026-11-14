import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { experiences } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody } from "../lib/http";
import {
  createExperienceSchema,
  updateExperienceSchema,
} from "../lib/validation";

export const experiencesRoutes = new Hono<{ Variables: AuthVariables }>();

experiencesRoutes.get("/", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(experiences)
      .where(eq(experiences.isActive, true))
      .orderBy(asc(experiences.sortOrder));
    return c.json({ ok: true, experiences: rows });
  } catch (error) {
    console.error("[experiences/list]", error);
    return c.json({ ok: false, error: "Failed to load experience" }, 500);
  }
});

experiencesRoutes.use("/admin/*", requireAuth);
experiencesRoutes.use("/admin", requireAuth);

experiencesRoutes.get("/admin", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.sortOrder));
    return c.json({ ok: true, experiences: rows });
  } catch (error) {
    console.error("[experiences/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load experience" }, 500);
  }
});

experiencesRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createExperienceSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const [row] = await db.insert(experiences).values(parsed.data).returning();
    return c.json({ ok: true, experience: row }, 201);
  } catch (error) {
    console.error("[experiences/create]", error);
    return c.json({ ok: false, error: "Failed to create experience" }, 400);
  }
});

experiencesRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateExperienceSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const [row] = await db
      .update(experiences)
      .set({ ...parsed.data, updatedAt: sql`now()` })
      .where(eq(experiences.id, id))
      .returning();
    if (!row) return c.json({ ok: false, error: "Experience not found" }, 404);
    return c.json({ ok: true, experience: row });
  } catch (error) {
    console.error("[experiences/update]", error);
    return c.json({ ok: false, error: "Failed to update experience" }, 400);
  }
});

experiencesRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id });
    if (!row) return c.json({ ok: false, error: "Experience not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[experiences/delete]", error);
    return c.json({ ok: false, error: "Failed to delete experience" }, 500);
  }
});
