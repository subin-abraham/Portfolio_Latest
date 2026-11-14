import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens"
  );

export const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional()
  .nullable()
  .transform((v) => {
    if (v == null || v === "") return null;
    return v;
  });

export const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .nullable()
  .transform((v) => {
    if (v == null || v === "") return null;
    return v;
  });

export const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((v) => v ?? null);

export const sortOrderSchema = z.number().int().min(0).max(100000).optional();

/**
 * Media fields upsert into media_assets; entities store media_asset_id UUID.
 * mediaAssetId = Hygraph provider asset handle (string).
 * mediaAssetIdRef = Neon media_assets.id (UUID) from /api/media/upload.
 */
export const mediaFieldsSchema = z.object({
  mediaUrl: optionalUrl,
  mediaAssetId: optionalText,
  mediaAssetIdRef: optionalUuid,
  mediaAltText: optionalText,
  mediaMimeType: optionalText,
});

export const createToolSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    slug: slugSchema,
    categoryId: optionalUuid,
    sortOrder: sortOrderSchema.default(0),
    isActive: z.boolean().optional().default(true),
  })
  .merge(mediaFieldsSchema);

export const updateToolSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    slug: slugSchema.optional(),
    categoryId: optionalUuid,
    sortOrder: sortOrderSchema,
    isActive: z.boolean().optional(),
    clearMedia: z.boolean().optional(),
    clearCategory: z.boolean().optional(),
  })
  .merge(mediaFieldsSchema);

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  tagline: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(10000).optional(),
  servicesBlurb: z.string().trim().max(5000).optional(),
  aboutTag: z.string().trim().max(200).optional(),
  aboutTitleStrong: z.string().trim().max(500).optional(),
  aboutTitleMuted: z.string().trim().max(500).optional(),
  email: optionalText,
  location: optionalText,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  websiteUrl: optionalUrl,
  portraitMediaAssetId: optionalUuid,
  mediaUrl: optionalUrl,
  mediaAssetId: optionalText,
  mediaAssetIdRef: optionalUuid,
  mediaAltText: optionalText,
  mediaMimeType: optionalText,
  clearPortrait: z.boolean().optional(),
});

export const createAboutStatSchema = z.object({
  value: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(120),
  detail: z.string().trim().max(1000).optional().default(""),
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateAboutStatSchema = createAboutStatSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: slugSchema,
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createSkillSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().max(120).optional().default(""),
  proficiency: z.number().int().min(0).max(100).optional().default(0),
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateSkillSchema = createSkillSchema.partial();

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: slugSchema,
    summary: z.string().trim().max(2000).optional().default(""),
    description: z.string().trim().max(50000).optional().default(""),
    role: z.string().trim().max(200).optional().default(""),
    techStack: z.string().trim().max(1000).optional().default(""),
    projectUrl: optionalUrl,
    repoUrl: optionalUrl,
    sortOrder: sortOrderSchema.default(0),
    isPublished: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    coverMediaAssetId: optionalUuid,
    clearCover: z.boolean().optional(),
  })
  .merge(mediaFieldsSchema);

export const updateProjectSchema = createProjectSchema.partial();

export const createProjectImageSchema = z.object({
  mediaAssetIdRef: z.string().uuid(),
  sortOrder: sortOrderSchema.default(0),
  caption: z.string().trim().max(500).optional().default(""),
});

export const createExperienceSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  location: z.string().trim().max(200).optional().default(""),
  summary: z.string().trim().max(10000).optional().default(""),
  tags: z.string().trim().max(2000).optional().default(""),
  startDate: z.string().trim().max(40).optional().default(""),
  endDate: optionalText,
  isCurrent: z.boolean().optional().default(false),
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const createEducationSchema = z.object({
  institution: z.string().trim().min(1).max(200),
  degree: z.string().trim().min(1).max(200),
  field: z.string().trim().max(200).optional().default(""),
  summary: z.string().trim().max(10000).optional().default(""),
  tags: z.string().trim().max(2000).optional().default(""),
  startDate: z.string().trim().max(40).optional().default(""),
  endDate: optionalText,
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateEducationSchema = createEducationSchema.partial();

export const createBlogSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: slugSchema,
    excerpt: z.string().trim().max(2000).optional().default(""),
    body: z.string().trim().max(100000).optional().default(""),
    publishedAt: z.string().datetime().optional().nullable(),
    isPublished: z.boolean().optional().default(false),
    sortOrder: sortOrderSchema.default(0),
    coverMediaAssetId: optionalUuid,
    clearCover: z.boolean().optional(),
  })
  .merge(mediaFieldsSchema);

export const updateBlogSchema = createBlogSchema.partial();

export const createTestimonialSchema = z
  .object({
    quote: z.string().trim().min(1).max(5000),
    authorName: z.string().trim().min(1).max(200),
    authorTitle: z.string().trim().max(200).optional().default(""),
    authorCompany: z.string().trim().max(200).optional().default(""),
    sortOrder: sortOrderSchema.default(0),
    isActive: z.boolean().optional().default(true),
    avatarMediaAssetId: optionalUuid,
    clearAvatar: z.boolean().optional(),
  })
  .merge(mediaFieldsSchema);

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
