import { and, asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { mediaAssets, projectImages, projects } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody, uniqueOrFail } from "../lib/http";
import { resolveMediaAssetId } from "../lib/resolve-media";
import {
  createProjectImageSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../lib/validation";

export const projectsRoutes = new Hono<{ Variables: AuthVariables }>();

async function loadProjectImages(projectId: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: projectImages.id,
      projectId: projectImages.projectId,
      mediaAssetId: projectImages.mediaAssetId,
      sortOrder: projectImages.sortOrder,
      caption: projectImages.caption,
      url: mediaAssets.url,
      altText: mediaAssets.altText,
    })
    .from(projectImages)
    .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
    .where(eq(projectImages.projectId, projectId))
    .orderBy(asc(projectImages.sortOrder));
  return rows;
}

async function mapProject(row: typeof projects.$inferSelect, includeImages: boolean) {
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
  return {
    ...row,
    cover,
    images: includeImages ? await loadProjectImages(row.id) : undefined,
  };
}

async function listProjects(publishedOnly: boolean) {
  const db = getDb();
  const rows = publishedOnly
    ? await db
        .select()
        .from(projects)
        .where(eq(projects.isPublished, true))
        .orderBy(asc(projects.sortOrder), asc(projects.title))
    : await db
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder), asc(projects.title));

  return Promise.all(rows.map((row) => mapProject(row, false)));
}

projectsRoutes.get("/", async (c) => {
  try {
    return c.json({ ok: true, projects: await listProjects(true) });
  } catch (error) {
    console.error("[projects/list]", error);
    return c.json({ ok: false, error: "Failed to load projects" }, 500);
  }
});

projectsRoutes.use("/admin/*", requireAuth);
projectsRoutes.use("/admin", requireAuth);

projectsRoutes.get("/admin", async (c) => {
  try {
    return c.json({ ok: true, projects: await listProjects(false) });
  } catch (error) {
    console.error("[projects/admin-list]", error);
    return c.json({ ok: false, error: "Failed to load projects" }, 500);
  }
});

projectsRoutes.post("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createProjectSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const coverId =
      (await resolveMediaAssetId(db, parsed.data, parsed.data.title)) ??
      parsed.data.coverMediaAssetId ??
      null;

    const [row] = await db
      .insert(projects)
      .values({
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary ?? "",
        description: parsed.data.description ?? "",
        role: parsed.data.role ?? "",
        techStack: parsed.data.techStack ?? "",
        projectUrl: parsed.data.projectUrl ?? null,
        repoUrl: parsed.data.repoUrl ?? null,
        coverMediaAssetId: coverId,
        sortOrder: parsed.data.sortOrder ?? 0,
        isPublished: parsed.data.isPublished ?? false,
        featured: parsed.data.featured ?? false,
      })
      .returning();

    return c.json({ ok: true, project: await mapProject(row, true) }, 201);
  } catch (error) {
    console.error("[projects/create]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A project with that slug already exists",
          "Failed to create project"
        ),
      },
      400
    );
  }
});

projectsRoutes.patch("/admin/:id", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateProjectSchema, json.body);
  if (!parsed.ok) return parsed.response;
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ ok: false, error: "No changes provided" }, 400);
  }

  try {
    const db = getDb();
    const existing = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
    if (!existing) return c.json({ ok: false, error: "Project not found" }, 404);

    const patch = parsed.data;
    const nextCover = await resolveMediaAssetId(
      db,
      { ...patch, clearCover: patch.clearCover },
      patch.title ?? existing.title
    );

    const [row] = await db
      .update(projects)
      .set({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
        ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
        ...(patch.description !== undefined
          ? { description: patch.description }
          : {}),
        ...(patch.role !== undefined ? { role: patch.role } : {}),
        ...(patch.techStack !== undefined ? { techStack: patch.techStack } : {}),
        ...(patch.projectUrl !== undefined
          ? { projectUrl: patch.projectUrl }
          : {}),
        ...(patch.repoUrl !== undefined ? { repoUrl: patch.repoUrl } : {}),
        ...(patch.sortOrder !== undefined ? { sortOrder: patch.sortOrder } : {}),
        ...(patch.isPublished !== undefined
          ? { isPublished: patch.isPublished }
          : {}),
        ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
        ...(nextCover !== undefined
          ? { coverMediaAssetId: nextCover }
          : patch.coverMediaAssetId !== undefined
            ? { coverMediaAssetId: patch.coverMediaAssetId }
            : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(projects.id, id))
      .returning();

    return c.json({ ok: true, project: await mapProject(row, true) });
  } catch (error) {
    console.error("[projects/update]", error);
    return c.json(
      {
        ok: false,
        error: uniqueOrFail(
          error,
          "A project with that slug already exists",
          "Failed to update project"
        ),
      },
      400
    );
  }
});

projectsRoutes.delete("/admin/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = getDb();
    const [row] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    if (!row) return c.json({ ok: false, error: "Project not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[projects/delete]", error);
    return c.json({ ok: false, error: "Failed to delete project" }, 500);
  }
});

projectsRoutes.post("/admin/:id/images", async (c) => {
  const id = c.req.param("id");
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, createProjectImageSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const existing = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
    if (!existing) return c.json({ ok: false, error: "Project not found" }, 404);

    const [row] = await db
      .insert(projectImages)
      .values({
        projectId: id,
        mediaAssetId: parsed.data.mediaAssetIdRef,
        sortOrder: parsed.data.sortOrder ?? 0,
        caption: parsed.data.caption ?? "",
      })
      .returning();

    return c.json({ ok: true, image: row, images: await loadProjectImages(id) }, 201);
  } catch (error) {
    console.error("[projects/image-add]", error);
    return c.json({ ok: false, error: "Failed to add project image" }, 400);
  }
});

projectsRoutes.delete("/admin/:id/images/:imageId", async (c) => {
  const id = c.req.param("id");
  const imageId = c.req.param("imageId");
  try {
    const db = getDb();
    const [row] = await db
      .delete(projectImages)
      .where(and(eq(projectImages.id, imageId), eq(projectImages.projectId, id)))
      .returning({ id: projectImages.id });
    if (!row) return c.json({ ok: false, error: "Image not found" }, 404);
    return c.json({ ok: true });
  } catch (error) {
    console.error("[projects/image-delete]", error);
    return c.json({ ok: false, error: "Failed to delete project image" }, 500);
  }
});

projectsRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const db = getDb();
    const row = await db.query.projects.findFirst({
      where: and(eq(projects.slug, slug), eq(projects.isPublished, true)),
    });
    if (!row) return c.json({ ok: false, error: "Project not found" }, 404);
    return c.json({ ok: true, project: await mapProject(row, true) });
  } catch (error) {
    console.error("[projects/get]", error);
    return c.json({ ok: false, error: "Failed to load project" }, 500);
  }
});
