import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { skills } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody, uniqueOrFail } from "../lib/http";
import { createSkillSchema, updateSkillSchema } from "../lib/validation";

export const skillsRoutes = new Hono<{ Variables: AuthVariables }>();

skillsRoutes.get("/", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(skills)
      .where(eq(skills.isActive, true))
      .orderBy(asc(skills.sortOrder), asc(skills.name));
    return c.json({ ok: true, skills: rows });
  } catch (error) {
    console.error("[skills/list]", error);
    return c.json({ ok: false, error: "Failed to load skills" }, 500);
  }
});

skillsRoutes.use("/admin/*", requireAuth);
skillsRoutes.use("/admin", requireAuth);

skillsRoutes.get("/admin", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.sortOrder), asc(skills.name));
    return c.json({ ok: true, skills: rows });
  } catch (error) {
    console.error("[skills/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load skills" }, 500);
  }
});

skillsRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createSkillSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const [row] = await db.insert(skills).values(parsed.data).returning();
    return c.json({ ok: true, skill: row }, 201);
  } catch (error) {
    console.error("[skills/create]", error);
    return c.json({ ok: false, error: "Failed to create skill" }, 400);
  }
});

skillsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateSkillSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const [row] = await db
      .update(skills)
      .set({ ...parsed.data, updatedAt: sql`now()` })
      .where(eq(skills.id, id))
      .returning();
    if (!row) return c.json({ ok: false, error: "Skill not found" }, 404);
    return c.json({ ok: true, skill: row });
  } catch (error) {
    console.error("[skills/update]", error);
    return c.json({ ok: false, error: "Failed to update skill" }, 400);
  }
});

skillsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning({ id: skills.id });
    if (!row) return c.json({ ok: false, error: "Skill not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[skills/delete]", error);
    return c.json(
      { ok: false, error: uniqueOrFail(error, "Cannot delete", "Failed to delete skill") },
      500
    );
  }
});
