import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { technologyCategories } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody, uniqueOrFail } from "../lib/http";
import { createCategorySchema, updateCategorySchema } from "../lib/validation";

export const categoriesRoutes = new Hono<{ Variables: AuthVariables }>();

categoriesRoutes.get("/", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(technologyCategories)
      .where(eq(technologyCategories.isActive, true))
      .orderBy(asc(technologyCategories.sortOrder), asc(technologyCategories.name));
    return c.json({ ok: true, categories: rows });
  } catch (error) {
    console.error("[categories/list]", error);
    return c.json({ ok: false, error: "Failed to load categories" }, 500);
  }
});

categoriesRoutes.use("/admin/*", requireAuth);
categoriesRoutes.use("/admin", requireAuth);

categoriesRoutes.get("/admin", async (c) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(technologyCategories)
      .orderBy(asc(technologyCategories.sortOrder), asc(technologyCategories.name));
    return c.json({ ok: true, categories: rows });
  } catch (error) {
    console.error("[categories/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load categories" }, 500);
  }
});

categoriesRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createCategorySchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const [row] = await db
      .insert(technologyCategories)
      .values(parsed.data)
      .returning();
    return c.json({ ok: true, category: row }, 201);
  } catch (error) {
    console.error("[categories/create]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A category with that slug already exists",
          "Failed to create category"
        ),
      },
      400
    );
  }
});

categoriesRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateCategorySchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const [row] = await db
      .update(technologyCategories)
      .set({ ...parsed.data, updatedAt: sql`now()` })
      .where(eq(technologyCategories.id, id))
      .returning();
    if (!row) return c.json({ ok: false, error: "Category not found" }, 404);
    return c.json({ ok: true, category: row });
  } catch (error) {
    console.error("[categories/update]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A category with that slug already exists",
          "Failed to update category"
        ),
      },
      400
    );
  }
});

categoriesRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(technologyCategories)
      .where(eq(technologyCategories.id, id))
      .returning({ id: technologyCategories.id });
    if (!row) return c.json({ ok: false, error: "Category not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[categories/delete]", error);
    return c.json({ ok: false, error: "Failed to delete category" }, 500);
  }
});
