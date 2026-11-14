import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { mediaAssets, tools } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { upsertHygraphMedia } from "../lib/media";
import { createToolSchema, updateToolSchema } from "../lib/validation";

export const toolsRoutes = new Hono<{ Variables: AuthVariables }>();

type ToolWithMedia = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  mediaAssetId: string | null;
  createdAt: Date;
  updatedAt: Date;
  media: {
    id: string;
    provider: string;
    assetId: string;
    url: string;
    altText: string;
    mimeType: string | null;
    fileName: string | null;
    createdAt: Date;
  } | null;
};

function mapTool(row: {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  mediaAssetId: string | null;
  createdAt: Date;
  updatedAt: Date;
  mediaId: string | null;
  mediaProvider: string | null;
  mediaAssetHandle: string | null;
  mediaUrl: string | null;
  mediaAltText: string | null;
  mediaMimeType: string | null;
  mediaFileName: string | null;
  mediaCreatedAt: Date | null;
}): ToolWithMedia {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    mediaAssetId: row.mediaAssetId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media:
      row.mediaId && row.mediaUrl
        ? {
            id: row.mediaId,
            provider: row.mediaProvider || "HYGRAPH",
            assetId: row.mediaAssetHandle || "",
            url: row.mediaUrl,
            altText: row.mediaAltText || "",
            mimeType: row.mediaMimeType,
            fileName: row.mediaFileName,
            createdAt: row.mediaCreatedAt || new Date(0),
          }
        : null,
  };
}

async function selectTools(activeOnly: boolean) {
  const db = getDb();
  const base = db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      sortOrder: tools.sortOrder,
      isActive: tools.isActive,
      mediaAssetId: tools.mediaAssetId,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt,
      mediaId: mediaAssets.id,
      mediaProvider: mediaAssets.provider,
      mediaAssetHandle: mediaAssets.assetId,
      mediaUrl: mediaAssets.url,
      mediaAltText: mediaAssets.altText,
      mediaMimeType: mediaAssets.mimeType,
      mediaFileName: mediaAssets.fileName,
      mediaCreatedAt: mediaAssets.createdAt,
    })
    .from(tools)
    .leftJoin(mediaAssets, eq(tools.mediaAssetId, mediaAssets.id));

  const rows = activeOnly
    ? await base
        .where(eq(tools.isActive, true))
        .orderBy(asc(tools.sortOrder), asc(tools.name))
    : await base.orderBy(asc(tools.sortOrder), asc(tools.name));

  return rows.map(mapTool);
}

/** Public: active tools. Image comes from media_assets when linked. */
toolsRoutes.get("/", async (c) => {
  try {
    const list = await selectTools(true);
    return c.json({
      ok: true,
      tools: list.map((tool) => ({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        sortOrder: tool.sortOrder,
        imageUrl: tool.media?.url ?? null,
        imageAlt: tool.media?.altText || tool.name,
      })),
    });
  } catch (error) {
    console.error("[tools/list]", error);
    return c.json({ ok: false, error: "Failed to load tools" }, 500);
  }
});

toolsRoutes.use("/admin/*", requireAuth);
toolsRoutes.use("/admin", requireAuth);

toolsRoutes.get("/admin", async (c) => {
  try {
    const list = await selectTools(false);
    return c.json({ ok: true, tools: list });
  } catch (error) {
    console.error("[tools/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load tools" }, 500);
  }
});

toolsRoutes.post("/admin", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "Invalid request body." }, 400);
  }

  const parsed = createToolSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message || "Invalid tool data",
      },
      400
    );
  }

  try {
    const db = getDb();
    let mediaAssetId: string | null = null;

    if (parsed.data.mediaAssetIdRef) {
      mediaAssetId = parsed.data.mediaAssetIdRef;
    } else if (parsed.data.mediaUrl) {
      const media = await upsertHygraphMedia(db, {
        url: parsed.data.mediaUrl,
        assetId: parsed.data.mediaAssetId,
        altText: parsed.data.mediaAltText ?? parsed.data.name,
        mimeType: parsed.data.mediaMimeType,
      });
      mediaAssetId = media?.id ?? null;
    }

    const [row] = await db
      .insert(tools)
      .values({
        name: parsed.data.name,
        slug: parsed.data.slug,
        mediaAssetId,
        categoryId: parsed.data.categoryId ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      })
      .returning();

    const list = await selectTools(false);
    const tool = list.find((t) => t.id === row.id) ?? null;
    return c.json({ ok: true, tool }, 201);
  } catch (error) {
    const message =
      error instanceof Error && /unique/i.test(error.message)
        ? "A tool with that slug already exists"
        : "Failed to create tool";
    console.error("[tools/create]", error);
    return c.json({ ok: false, error: message }, 400);
  }
});

toolsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "Invalid request body." }, 400);
  }

  const parsed = updateToolSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message || "Invalid tool data",
      },
      400
    );
  }

  const patch = parsed.data;
  if (Object.keys(patch).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const existing = await db.query.tools.findFirst({
      where: eq(tools.id, id),
    });
    if (!existing) {
      return c.json({ ok: false, error: "Tool not found" }, 404);
    }

    let nextMediaId: string | null | undefined = undefined;

    if (patch.clearMedia) {
      nextMediaId = null;
    } else if (patch.mediaAssetIdRef) {
      nextMediaId = patch.mediaAssetIdRef;
    } else if (patch.mediaUrl) {
      const media = await upsertHygraphMedia(db, {
        url: patch.mediaUrl,
        assetId: patch.mediaAssetId,
        altText: patch.mediaAltText ?? patch.name ?? existing.name,
        mimeType: patch.mediaMimeType,
      });
      nextMediaId = media?.id ?? null;
    }

    let nextCategoryId: string | null | undefined = undefined;
    if (patch.clearCategory) nextCategoryId = null;
    else if (patch.categoryId !== undefined) nextCategoryId = patch.categoryId;

    const [row] = await db
      .update(tools)
      .set({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
        ...(patch.sortOrder !== undefined ? { sortOrder: patch.sortOrder } : {}),
        ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
        ...(nextMediaId !== undefined ? { mediaAssetId: nextMediaId } : {}),
        ...(nextCategoryId !== undefined ? { categoryId: nextCategoryId } : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(tools.id, id))
      .returning();

    if (!row) {
      return c.json({ ok: false, error: "Tool not found" }, 404);
    }

    const list = await selectTools(false);
    const tool = list.find((t) => t.id === row.id) ?? null;
    return c.json({ ok: true, tool });
  } catch (error) {
    const message =
      error instanceof Error && /unique/i.test(error.message)
        ? "A tool with that slug already exists"
        : "Failed to update tool";
    console.error("[tools/update]", error);
    return c.json({ ok: false, error: message }, 400);
  }
});

toolsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const db = getDb();
    const [row] = await db
      .delete(tools)
      .where(eq(tools.id, id))
      .returning({ id: tools.id });

    if (!row) {
      return c.json({ ok: false, error: "Tool not found" }, 404);
    }

    return c.json({ ok: true });
  } catch (error) {
    console.error("[tools/delete]", error);
    return c.json({ ok: false, error: "Failed to delete tool" }, 500);
  }
});
