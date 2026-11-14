import { and, asc, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { blogs, mediaAssets } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody, uniqueOrFail } from "../lib/http";
import { resolveMediaAssetId } from "../lib/resolve-media";
import { createBlogSchema, updateBlogSchema } from "../lib/validation";

export const blogsRoutes = new Hono<{ Variables: AuthVariables }>();

async function mapBlog(row: typeof blogs.$inferSelect) {
  const db = getDb();
  let cover: { id: string; url: string; altText: string } | null = null;
  if (row.coverMediaAssetId) {
    const media = await db.query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, row.coverMediaAssetId),
    });
    if (media) {
      cover = { id: media.id, url: media.url, altText: media.altText };
    }
  }
  return { ...row, cover };
}

async function listBlogs(publishedOnly: boolean) {
  const db = getDb();
  const rows = publishedOnly
    ? await db
        .select()
        .from(blogs)
        .where(eq(blogs.isPublished, true))
        .orderBy(desc(blogs.publishedAt), asc(blogs.sortOrder))
    : await db
        .select()
        .from(blogs)
        .orderBy(asc(blogs.sortOrder), asc(blogs.title));
  return Promise.all(rows.map(mapBlog));
}

blogsRoutes.get("/", async (c) => {
  try {
    return c.json({ ok: true, blogs: await listBlogs(true) });
  } catch (error) {
    console.error("[blogs/list]", error);
    return c.json({ ok: false, error: "Failed to load blogs" }, 500);
  }
});

blogsRoutes.use("/admin/*", requireAuth);
blogsRoutes.use("/admin", requireAuth);

blogsRoutes.get("/admin", async (c) => {
  try {
    return c.json({ ok: true, blogs: await listBlogs(false) });
  } catch (error) {
    console.error("[blogs/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load blogs" }, 500);
  }
});

blogsRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createBlogSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const coverId =
      (await resolveMediaAssetId(db, parsed.data, parsed.data.title)) ??
      parsed.data.coverMediaAssetId ??
      null;

    const [row] = await db
      .insert(blogs)
      .values({
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt ?? "",
        body: parsed.data.body ?? "",
        coverMediaAssetId: coverId,
        publishedAt: parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : null,
        isPublished: parsed.data.isPublished ?? false,
        sortOrder: parsed.data.sortOrder ?? 0,
      })
      .returning();

    return c.json({ ok: true, blog: await mapBlog(row) }, 201);
  } catch (error) {
    console.error("[blogs/create]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A blog with that slug already exists",
          "Failed to create blog"
        ),
      },
      400
    );
  }
});

blogsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateBlogSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const existing = await db.query.blogs.findFirst({ where: eq(blogs.id, id) });
    if (!existing) return c.json({ ok: false, error: "Blog not found" }, 404);

    const patch = parsed.data;
    const nextCover = await resolveMediaAssetId(
      db,
      { ...patch, clearCover: patch.clearCover },
      patch.title ?? existing.title
    );

    const [row] = await db
      .update(blogs)
      .set({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
        ...(patch.excerpt !== undefined ? { excerpt: patch.excerpt } : {}),
        ...(patch.body !== undefined ? { body: patch.body } : {}),
        ...(patch.sortOrder !== undefined ? { sortOrder: patch.sortOrder } : {}),
        ...(patch.isPublished !== undefined
          ? { isPublished: patch.isPublished }
          : {}),
        ...(patch.publishedAt !== undefined
          ? {
              publishedAt: patch.publishedAt
                ? new Date(patch.publishedAt)
                : null,
            }
          : {}),
        ...(nextCover !== undefined
          ? { coverMediaAssetId: nextCover }
          : patch.coverMediaAssetId !== undefined
            ? { coverMediaAssetId: patch.coverMediaAssetId }
            : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(blogs.id, id))
      .returning();

    return c.json({ ok: true, blog: await mapBlog(row) });
  } catch (error) {
    console.error("[blogs/update]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A blog with that slug already exists",
          "Failed to update blog"
        ),
      },
      400
    );
  }
});

blogsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(blogs)
      .where(eq(blogs.id, id))
      .returning({ id: blogs.id });
    if (!row) return c.json({ ok: false, error: "Blog not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[blogs/delete]", error);
    return c.json({ ok: false, error: "Failed to delete blog" }, 500);
  }
});

blogsRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const db = getDb();
    const row = await db.query.blogs.findFirst({
      where: and(eq(blogs.slug, slug), eq(blogs.isPublished, true)),
    });
    if (!row) return c.json({ ok: false, error: "Blog not found" }, 404);
    return c.json({ ok: true, blog: await mapBlog(row) });
  } catch (error) {
    console.error("[blogs/get]", error);
    return c.json({ ok: false, error: "Failed to load blog" }, 500);
  }
});
