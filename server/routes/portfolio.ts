import { asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import {
  aboutStats,
  blogs,
  education,
  experiences,
  mediaAssets,
  profile,
  projects,
  skills,
  testimonials,
  tools,
} from "../../src/db/schema";

export const portfolioRoutes = new Hono();

/** Aggregate public portfolio payload for the homepage. */
portfolioRoutes.get("/", async (c) => {
  try {
    const db = getDb();

    let profileRow = await db.query.profile.findFirst();
    if (!profileRow) {
      const [created] = await db
        .insert(profile)
        .values({
          displayName: "Subin",
          tagline:
            "I design user-centered digital experiences that are simple smart and impactful",
        })
        .returning();
      profileRow = created;
    }

    let portraitUrl: string | null = null;
    let portraitAlt = profileRow.displayName;
    if (profileRow.portraitMediaAssetId) {
      const media = await db.query.mediaAssets.findFirst({
        where: eq(mediaAssets.id, profileRow.portraitMediaAssetId),
      });
      if (media) {
        portraitUrl = media.url;
        portraitAlt = media.altText || profileRow.displayName;
      }
    }

    const [
      aboutStatRows,
      skillRows,
      projectRows,
      experienceRows,
      educationRows,
      blogRows,
      testimonialRows,
      toolRows,
    ] = await Promise.all([
      db
        .select({
          id: aboutStats.id,
          value: aboutStats.value,
          title: aboutStats.title,
          detail: aboutStats.detail,
          sortOrder: aboutStats.sortOrder,
        })
        .from(aboutStats)
        .where(eq(aboutStats.isActive, true))
        .orderBy(asc(aboutStats.sortOrder), asc(aboutStats.title)),
      db
        .select()
        .from(skills)
        .where(eq(skills.isActive, true))
        .orderBy(asc(skills.sortOrder), asc(skills.name)),
      db
        .select({
          id: projects.id,
          title: projects.title,
          slug: projects.slug,
          summary: projects.summary,
          role: projects.role,
          techStack: projects.techStack,
          projectUrl: projects.projectUrl,
          featured: projects.featured,
          sortOrder: projects.sortOrder,
          coverUrl: mediaAssets.url,
          coverAlt: mediaAssets.altText,
        })
        .from(projects)
        .leftJoin(mediaAssets, eq(projects.coverMediaAssetId, mediaAssets.id))
        .where(eq(projects.isPublished, true))
        .orderBy(asc(projects.sortOrder), asc(projects.title)),
      db
        .select()
        .from(experiences)
        .where(eq(experiences.isActive, true))
        .orderBy(asc(experiences.sortOrder)),
      db
        .select()
        .from(education)
        .where(eq(education.isActive, true))
        .orderBy(asc(education.sortOrder)),
      db
        .select({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          excerpt: blogs.excerpt,
          publishedAt: blogs.publishedAt,
          sortOrder: blogs.sortOrder,
          coverUrl: mediaAssets.url,
          coverAlt: mediaAssets.altText,
        })
        .from(blogs)
        .leftJoin(mediaAssets, eq(blogs.coverMediaAssetId, mediaAssets.id))
        .where(eq(blogs.isPublished, true))
        .orderBy(desc(blogs.publishedAt), asc(blogs.sortOrder)),
      db
        .select({
          id: testimonials.id,
          quote: testimonials.quote,
          authorName: testimonials.authorName,
          authorTitle: testimonials.authorTitle,
          authorCompany: testimonials.authorCompany,
          sortOrder: testimonials.sortOrder,
          avatarUrl: mediaAssets.url,
          avatarAlt: mediaAssets.altText,
        })
        .from(testimonials)
        .leftJoin(
          mediaAssets,
          eq(testimonials.avatarMediaAssetId, mediaAssets.id)
        )
        .where(eq(testimonials.isActive, true))
        .orderBy(asc(testimonials.sortOrder)),
      db
        .select({
          id: tools.id,
          name: tools.name,
          slug: tools.slug,
          sortOrder: tools.sortOrder,
          imageUrl: mediaAssets.url,
          imageAlt: mediaAssets.altText,
        })
        .from(tools)
        .leftJoin(mediaAssets, eq(tools.mediaAssetId, mediaAssets.id))
        .where(eq(tools.isActive, true))
        .orderBy(asc(tools.sortOrder), asc(tools.name)),
    ]);

    return c.json({
      ok: true,
      portfolio: {
        profile: {
          displayName: profileRow.displayName,
          tagline: profileRow.tagline,
          bio: profileRow.bio,
          servicesBlurb: profileRow.servicesBlurb,
          aboutTag: profileRow.aboutTag,
          aboutTitleStrong: profileRow.aboutTitleStrong,
          aboutTitleMuted: profileRow.aboutTitleMuted,
          email: profileRow.email,
          location: profileRow.location,
          githubUrl: profileRow.githubUrl,
          linkedinUrl: profileRow.linkedinUrl,
          twitterUrl: profileRow.twitterUrl,
          websiteUrl: profileRow.websiteUrl,
          portraitUrl,
          portraitAlt,
        },
        aboutStats: aboutStatRows,
        skills: skillRows,
        projects: projectRows.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          role: p.role,
          techStack: p.techStack,
          projectUrl: p.projectUrl,
          featured: p.featured,
          sortOrder: p.sortOrder,
          coverUrl: p.coverUrl,
          coverAlt: p.coverAlt || p.title,
        })),
        experiences: experienceRows.map((item) => ({
          id: item.id,
          company: item.company,
          role: item.role,
          location: item.location,
          summary: item.summary,
          tags: item.tags,
          startDate: item.startDate,
          endDate: item.endDate,
          isCurrent: item.isCurrent,
        })),
        education: educationRows.map((item) => ({
          id: item.id,
          institution: item.institution,
          degree: item.degree,
          field: item.field,
          summary: item.summary,
          tags: item.tags,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
        blogs: blogRows.map((b) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          publishedAt: b.publishedAt,
          sortOrder: b.sortOrder,
          coverUrl: b.coverUrl,
          coverAlt: b.coverAlt || b.title,
        })),
        testimonials: testimonialRows.map((t) => ({
          id: t.id,
          quote: t.quote,
          authorName: t.authorName,
          authorTitle: t.authorTitle,
          authorCompany: t.authorCompany,
          sortOrder: t.sortOrder,
          avatarUrl: t.avatarUrl,
          avatarAlt: t.avatarAlt || t.authorName,
        })),
        tools: toolRows.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          sortOrder: t.sortOrder,
          imageUrl: t.imageUrl,
          imageAlt: t.imageAlt || t.name,
        })),
      },
    });
  } catch (error) {
    console.error("[portfolio/get]", error);
    return c.json({ ok: false, error: "Failed to load portfolio" }, 500);
  }
});
