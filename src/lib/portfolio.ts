export type PortfolioPayload = {
  profile: {
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
    portraitUrl: string | null;
    portraitAlt: string;
  };
  aboutStats: Array<{
    id: string;
    value: string;
    title: string;
    detail: string;
    sortOrder: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: number;
    sortOrder: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    role: string;
    techStack: string;
    projectUrl: string | null;
    featured: boolean;
    sortOrder: number;
    coverUrl: string | null;
    coverAlt: string;
  }>;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    summary: string;
    tags: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    summary: string;
    tags: string;
    startDate: string;
    endDate: string | null;
  }>;
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string | null;
    coverUrl: string | null;
    coverAlt: string;
  }>;
  testimonials: Array<{
    id: string;
    quote: string;
    authorName: string;
    authorTitle: string;
    authorCompany: string;
    avatarUrl: string | null;
    avatarAlt: string;
  }>;
  tools: Array<{
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    imageAlt: string;
  }>;
};

export async function fetchPortfolio(): Promise<PortfolioPayload | null> {
  try {
    const res = await fetch("/api/portfolio");
    const json = (await res.json()) as {
      ok?: boolean;
      portfolio?: PortfolioPayload;
    };
    if (!res.ok || !json.ok || !json.portfolio) return null;
    return json.portfolio;
  } catch {
    return null;
  }
}
