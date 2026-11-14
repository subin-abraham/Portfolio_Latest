import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { mediaAssets, profile } from "../../src/db/schema";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { parseBody, readJsonBody } from "../lib/http";
import { resolveMediaAssetId } from "../lib/resolve-media";
import { updateProfileSchema } from "../lib/validation";

export const profileRoutes = new Hono<{ Variables: AuthVariables }>();

async function getOrCreateProfile() {
  const db = getDb();
  const existing = await db.query.profile.findFirst();
  if (existing) return existing;
  const [row] = await db
    .insert(profile)
    .values({
      displayName: "Subin",
      tagline:
        "I design user-centered digital experiences that are simple smart and impactful",
    })
    .returning();
  return row;
}

async function mapProfile(row: typeof profile.$inferSelect) {
  const db = getDb();
  let portrait: {
    id: string;
    url: string;
    altText: string;
    mimeType: string | null;
  } | null = null;

  if (row.portraitMediaAssetId) {
    const media = await db.query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, row.portraitMediaAssetId),
    });
    if (media) {
      portrait = {
        id: media.id,
        url: media.url,
        altText: media.altText,
        mimeType: media.mimeType,
      };
    }
  }

  return {
    id: row.id,
    displayName: row.displayName,
    tagline: row.tagline,
    bio: row.bio,
    servicesBlurb: row.servicesBlurb,
    aboutTag: row.aboutTag,
    aboutTitleStrong: row.aboutTitleStrong,
    aboutTitleMuted: row.aboutTitleMuted,
    email: row.email,
    location: row.location,
    githubUrl: row.githubUrl,
    linkedinUrl: row.linkedinUrl,
    twitterUrl: row.twitterUrl,
    websiteUrl: row.websiteUrl,
    portraitMediaAssetId: row.portraitMediaAssetId,
    portrait,
    updatedAt: row.updatedAt,
  };
}

profileRoutes.get("/", async (c) => {
  try {
    const row = await getOrCreateProfile();
    return c.json({ ok: true, profile: await mapProfile(row) });
  } catch (error) {
    console.error("[profile/get]", error);
    return c.json({ ok: false, error: "Failed to load profile" }, 500);
  }
});

profileRoutes.use("/admin", requireAuth);
profileRoutes.use("/admin/*", requireAuth);

profileRoutes.get("/admin", async (c) => {
  try {
    const row = await getOrCreateProfile();
    return c.json({ ok: true, profile: await mapProfile(row) });
  } catch (error) {
    console.error("[profile/admin-get]", error);
    return c.json({ ok: false, error: "Failed to load profile" }, 500);
  }
});

profileRoutes.patch("/admin", async (c) => {
  const json = await readJsonBody(c);
  if (!json.ok) return json.response;
  const parsed = parseBody(c, updateProfileSchema, json.body);
  if (!parsed.ok) return parsed.response;

  try {
    const db = getDb();
    const current = await getOrCreateProfile();
    const patch = parsed.data;
    const nextPortrait = await resolveMediaAssetId(
      db,
      {
        ...patch,
        clearPortrait: patch.clearPortrait,
        mediaAssetIdRef: patch.mediaAssetIdRef ?? patch.portraitMediaAssetId,
      },
      patch.displayName ?? current.displayName
    );

    const [row] = await db
      .update(profile)
      .set({
        ...(patch.displayName !== undefined
          ? { displayName: patch.displayName }
          : {}),
        ...(patch.tagline !== undefined ? { tagline: patch.tagline } : {}),
        ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
        ...(patch.servicesBlurb !== undefined
          ? { servicesBlurb: patch.servicesBlurb }
          : {}),
        ...(patch.aboutTag !== undefined ? { aboutTag: patch.aboutTag } : {}),
        ...(patch.aboutTitleStrong !== undefined
          ? { aboutTitleStrong: patch.aboutTitleStrong }
          : {}),
        ...(patch.aboutTitleMuted !== undefined
          ? { aboutTitleMuted: patch.aboutTitleMuted }
          : {}),
        ...(patch.email !== undefined ? { email: patch.email } : {}),
        ...(patch.location !== undefined ? { location: patch.location } : {}),
        ...(patch.githubUrl !== undefined ? { githubUrl: patch.githubUrl } : {}),
        ...(patch.linkedinUrl !== undefined
          ? { linkedinUrl: patch.linkedinUrl }
          : {}),
        ...(patch.twitterUrl !== undefined
          ? { twitterUrl: patch.twitterUrl }
          : {}),
        ...(patch.websiteUrl !== undefined
          ? { websiteUrl: patch.websiteUrl }
          : {}),
        ...(nextPortrait !== undefined
          ? { portraitMediaAssetId: nextPortrait }
          : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(profile.id, current.id))
      .returning();

    return c.json({ ok: true, profile: await mapProfile(row) });
  } catch (error) {
    console.error("[profile/update]", error);
    return c.json({ ok: false, error: "Failed to update profile" }, 500);
  }
});
