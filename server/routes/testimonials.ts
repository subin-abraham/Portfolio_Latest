import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { mediaAssets, testimonials } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody } from "../lib/http";
import { resolveMediaAssetId } from "../lib/resolve-media";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "../lib/validation";

export const testimonialsRoutes = new Hono<{ Variables: AuthVariables }>();

async function mapTestimonial(row: typeof testimonials.$inferSelect) {
  const db = getDb();
  let avatar: { id: string; url: string; altText: string } | null = null;
  if (row.avatarMediaAssetId) {
    const media = await db.query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, row.avatarMediaAssetId),
    });
    if (media) {
      avatar = { id: media.id, url: media.url, altText: media.altText };
    }
  }
  return { ...row, avatar };
}

async function listTestimonials(activeOnly: boolean) {
  const db = getDb();
  const rows = activeOnly
    ? await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(asc(testimonials.sortOrder))
    : await db
        .select()
        .from(testimonials)
        .orderBy(asc(testimonials.sortOrder));
  return Promise.all(rows.map(mapTestimonial));
}

testimonialsRoutes.get("/", async (c) => {
  try {
    return c.json({
      ok: true,
      testimonials: await listTestimonials(true),
    });
  } catch (error) {
    console.error("[testimonials/list]", error);
    return c.json({ ok: false, error: "Failed to load testimonials" }, 500);
  }
});

testimonialsRoutes.use("/admin/*", requireAuth);
testimonialsRoutes.use("/admin", requireAuth);

testimonialsRoutes.get("/admin", async (c) => {
  try {
    return c.json({
      ok: true,
      testimonials: await listTestimonials(false),
    });
  } catch (error) {
    console.error("[testimonials/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load testimonials" }, 500);
  }
});

testimonialsRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createTestimonialSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const avatarId =
      (await resolveMediaAssetId(db, parsed.data, parsed.data.authorName)) ??
      parsed.data.avatarMediaAssetId ??
      null;

    const [row] = await db
      .insert(testimonials)
      .values({
        quote: parsed.data.quote,
        authorName: parsed.data.authorName,
        authorTitle: parsed.data.authorTitle ?? "",
        authorCompany: parsed.data.authorCompany ?? "",
        avatarMediaAssetId: avatarId,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      })
      .returning();

    return c.json({ ok: true, testimonial: await mapTestimonial(row) }, 201);
  } catch (error) {
    console.error("[testimonials/create]", error);
    return c.json({ ok: false, error: "Failed to create testimonial" }, 400);
  }
});

testimonialsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateTestimonialSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const existing = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id),
    });
    if (!existing) {
      return c.json({ ok: false, error: "Testimonial not found" }, 404);
    }

    const patch = parsed.data;
    const nextAvatar = await resolveMediaAssetId(
      db,
      { ...patch, clearAvatar: patch.clearAvatar },
      patch.authorName ?? existing.authorName
    );

    const [row] = await db
      .update(testimonials)
      .set({
        ...(patch.quote !== undefined ? { quote: patch.quote } : {}),
        ...(patch.authorName !== undefined
          ? { authorName: patch.authorName }
          : {}),
        ...(patch.authorTitle !== undefined
          ? { authorTitle: patch.authorTitle }
          : {}),
        ...(patch.authorCompany !== undefined
          ? { authorCompany: patch.authorCompany }
          : {}),
        ...(patch.sortOrder !== undefined ? { sortOrder: patch.sortOrder } : {}),
        ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
        ...(nextAvatar !== undefined
          ? { avatarMediaAssetId: nextAvatar }
          : patch.avatarMediaAssetId !== undefined
            ? { avatarMediaAssetId: patch.avatarMediaAssetId }
            : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(testimonials.id, id))
      .returning();

    return c.json({ ok: true, testimonial: await mapTestimonial(row) });
  } catch (error) {
    console.error("[testimonials/update]", error);
    return c.json({ ok: false, error: "Failed to update testimonial" }, 400);
  }
});

testimonialsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning({ id: testimonials.id });
    if (!row) return c.json({ ok: false, error: "Testimonial not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[testimonials/delete]", error);
    return c.json({ ok: false, error: "Failed to delete testimonial" }, 500);
  }
});
