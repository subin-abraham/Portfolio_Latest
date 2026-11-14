import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { education } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody } from "../lib/http";
import {
  createEducationSchema,
  updateEducationSchema,
} from "../lib/validation";

export const educationRoutes = new Hono<{ Variables: AuthVariables }>();

educationRoutes.get("/", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(education)
      .where(eq(education.isActive, true))
      .orderBy(asc(education.sortOrder));
    return c.json({ ok: true, education: rows });
  } catch (error) {
    console.error("[education/list]", error);
    return c.json({ ok: false, error: "Failed to load education" }, 500);
  }
});

educationRoutes.use("/admin/*", requireAuth);
educationRoutes.use("/admin", requireAuth);

educationRoutes.get("/admin", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(education)
      .orderBy(asc(education.sortOrder));
    return c.json({ ok: true, education: rows });
  } catch (error) {
    console.error("[education/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load education" }, 500);
  }
});

educationRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createEducationSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const [row] = await db.insert(education).values(parsed.data).returning();
    return c.json({ ok: true, education: row }, 201);
  } catch (error) {
    console.error("[education/create]", error);
    return c.json({ ok: false, error: "Failed to create education" }, 400);
  }
});

educationRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateEducationSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const [row] = await db
      .update(education)
      .set({ ...parsed.data, updatedAt: sql`now()` })
      .where(eq(education.id, id))
      .returning();
    if (!row) return c.json({ ok: false, error: "Education not found" }, 404);
    return c.json({ ok: true, education: row });
  } catch (error) {
    console.error("[education/update]", error);
    return c.json({ ok: false, error: "Failed to update education" }, 400);
  }
});

educationRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(education)
      .where(eq(education.id, id))
      .returning({ id: education.id });
    if (!row) return c.json({ ok: false, error: "Education not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[education/delete]", error);
    return c.json({ ok: false, error: "Failed to delete education" }, 500);
  }
});
