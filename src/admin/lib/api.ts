type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

function buildHeaders(
  extra?: HeadersInit,
  jsonBody = true
): HeadersInit {
  const headers: Record<string, string> = {};
  if (jsonBody) {
    headers["Content-Type"] = "application/json";
  }
  return { ...headers, ...(extra as Record<string, string> | undefined) };
}

export async function request<T>(
  path: string,
  init?: RequestInit & { skipJsonContentType?: boolean }
): Promise<ApiResult<T>> {
  try {
    const { skipJsonContentType, ...fetchInit } = init ?? {};
    const res = await fetch(path, {
      ...fetchInit,
      credentials: "include",
      headers: buildHeaders(
        fetchInit.headers,
        !skipJsonContentType && !(fetchInit.body instanceof FormData)
      ),
    });

    const json = (await res.json().catch(() => ({}))) as T & {
      ok?: boolean;
      error?: string;
    };

    if (!res.ok || json.ok === false) {
      return {
        ok: false,
        error: json.error || "Request failed",
        status: res.status,
      };
    }

    return { ok: true, data: json as T };
  } catch {
    return {
      ok: false,
      error: "Cannot reach the admin API. Is the server running?",
      status: 0,
    };
  }
}

export type MediaAssetRecord = {
  id: string;
  provider: string;
  assetId: string;
  url: string;
  altText: string;
  mimeType: string | null;
  fileName?: string | null;
  createdAt?: string;
};

export type ToolRecord = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  mediaAssetId: string | null;
  categoryId?: string | null;
  media: MediaAssetRecord | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicTool = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  imageUrl: string | null;
  imageAlt: string;
};

export type ToolMediaInput = {
  mediaUrl?: string | null;
  mediaAssetId?: string | null;
  mediaAssetIdRef?: string | null;
  mediaAltText?: string | null;
  mediaMimeType?: string | null;
  clearMedia?: boolean;
  categoryId?: string | null;
  clearCategory?: boolean;
};

export type ProfileRecord = {
  id: string;
  displayName: string;
  tagline: string;
  bio: string;
  servicesBlurb: string;
  aboutTag: string;
  aboutTitleStrong: string;
  aboutTitleMuted: string;
  email: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  portraitMediaAssetId: string | null;
  portrait: {
    id: string;
    url: string;
    altText: string;
    mimeType: string | null;
  } | null;
};

export type AboutStatRecord = {
  id: string;
  value: string;
  title: string;
  detail: string;
  sortOrder: number;
  isActive: boolean;
};

export function fetchPublicTools() {
  return request<{ ok: true; tools: PublicTool[] }>("/api/tools");
}

export function fetchAdminTools() {
  return request<{ ok: true; tools: ToolRecord[] }>("/api/tools/admin");
}

export function createTool(
  body: {
    name: string;
    slug: string;
    sortOrder?: number;
    isActive?: boolean;
  } & ToolMediaInput
) {
  return request<{ ok: true; tool: ToolRecord }>("/api/tools/admin", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateTool(
  id: string,
  body: {
    name?: string;
    slug?: string;
    sortOrder?: number;
    isActive?: boolean;
  } & ToolMediaInput
) {
  return request<{ ok: true; tool: ToolRecord }>(`/api/tools/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteTool(id: string) {
  return request<{ ok: true }>(`/api/tools/admin/${id}`, {
    method: "DELETE",
  });
}

export function uploadMedia(file: File, altText?: string) {
  const form = new FormData();
  form.append("file", file);
  if (altText?.trim()) {
    form.append("altText", altText.trim());
  }

  return request<{ ok: true; media: MediaAssetRecord }>("/api/media/upload", {
    method: "POST",
    body: form,
    skipJsonContentType: true,
  });
}

export function fetchAdminProfile() {
  return request<{ ok: true; profile: ProfileRecord }>("/api/profile/admin");
}

export function updateAdminProfile(body: Record<string, unknown>) {
  return request<{ ok: true; profile: ProfileRecord }>("/api/profile/admin", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

function crudApi<TListKey extends string, TItemKey extends string, TItem>(
  base: string,
  listKey: TListKey,
  itemKey: TItemKey
) {
  return {
    list: () =>
      request<{ ok: true } & Record<TListKey, TItem[]>>(`${base}/admin`),
    create: (body: Record<string, unknown>) =>
      request<{ ok: true } & Record<TItemKey, TItem>>(`${base}/admin`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ ok: true } & Record<TItemKey, TItem>>(`${base}/admin/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request<{ ok: true }>(`${base}/admin/${id}`, { method: "DELETE" }),
    listKey,
    itemKey,
  };
}

export type SkillRecord = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
  isActive: boolean;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  role: string;
  techStack: string;
  projectUrl: string | null;
  repoUrl: string | null;
  coverMediaAssetId: string | null;
  sortOrder: number;
  isPublished: boolean;
  featured: boolean;
  cover?: { id: string; url: string; altText: string } | null;
};

export type ExperienceRecord = {
  id: string;
  company: string;
  role: string;
  location: string;
  summary: string;
  tags: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
  isActive: boolean;
};

export type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  summary: string;
  tags: string;
  startDate: string;
  endDate: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverMediaAssetId: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  sortOrder: number;
  cover?: { id: string; url: string; altText: string } | null;
};

export type TestimonialRecord = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  avatarMediaAssetId: string | null;
  sortOrder: number;
  isActive: boolean;
  avatar?: { id: string; url: string; altText: string } | null;
};

export const aboutStatsApi = crudApi<"aboutStats", "aboutStat", AboutStatRecord>(
  "/api/about-stats",
  "aboutStats",
  "aboutStat"
);

export const skillsApi = crudApi<"skills", "skill", SkillRecord>(
  "/api/skills",
  "skills",
  "skill"
);
export const categoriesApi = crudApi<"categories", "category", CategoryRecord>(
  "/api/categories",
  "categories",
  "category"
);
export const projectsApi = crudApi<"projects", "project", ProjectRecord>(
  "/api/projects",
  "projects",
  "project"
);
export const experiencesApi = crudApi<"experiences", "experience", ExperienceRecord>(
  "/api/experience",
  "experiences",
  "experience"
);
export const educationApi = crudApi<"education", "education", EducationRecord>(
  "/api/education",
  "education",
  "education"
);
export const blogsApi = crudApi<"blogs", "blog", BlogRecord>(
  "/api/blogs",
  "blogs",
  "blog"
);
export const testimonialsApi = crudApi<
  "testimonials",
  "testimonial",
  TestimonialRecord
>("/api/testimonials", "testimonials", "testimonial");
