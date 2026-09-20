import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { splitLines } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "./defaults";
import type {
  ArticleDTO,
  ArticleListDTO,
  HomepageDTO,
  IndustryDTO,
  ServiceDTO,
  SiteSettingsDTO,
} from "./types";

/**
 * Public read layer. Everything here:
 *  - filters to PUBLISHED content only (drafts can never be returned),
 *  - selects an explicit list of public fields,
 *  - is cached for 5 minutes and purged instantly by admin edits
 *    (see revalidatePublicContent in src/lib/admin/revalidate.ts).
 */

export const CACHE_TAGS = {
  site: "site",
  homepage: "homepage",
  services: "services",
  industries: "industries",
  articles: "articles",
} as const;

const REVALIDATE_SECONDS = 300;

const serviceInclude = {
  industries: {
    where: { industry: { status: "PUBLISHED" as const } },
    orderBy: { industry: { displayOrder: "asc" as const } },
    select: { industry: { select: { id: true, name: true, slug: true } } },
  },
};

type ServiceRow = Awaited<ReturnType<typeof findServiceRows>>[number];

function findServiceRows(where: object) {
  return prisma.service.findMany({
    where: { status: "PUBLISHED", ...where },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    include: serviceInclude,
  });
}

function toService(row: ServiceRow): ServiceDTO {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.shortDescription,
    description: row.description,
    capabilities: splitLines(row.capabilities),
    businessValue: row.businessValue,
    icon: row.icon,
    coverImage: row.coverImage,
    featured: row.featured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    updatedAt: row.updatedAt.toISOString(),
    industries: row.industries.map((i) => i.industry),
  };
}

const industryInclude = {
  services: {
    where: { service: { status: "PUBLISHED" as const } },
    orderBy: { service: { displayOrder: "asc" as const } },
    select: { service: { select: { id: true, title: true, slug: true } } },
  },
};

type IndustryRow = Awaited<ReturnType<typeof findIndustryRows>>[number];

function findIndustryRows(where: object) {
  return prisma.industry.findMany({
    where: { status: "PUBLISHED", ...where },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: industryInclude,
  });
}

function toIndustry(row: IndustryRow): IndustryDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    icon: row.icon,
    featured: row.featured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    updatedAt: row.updatedAt.toISOString(),
    services: row.services.map((s) => s.service),
  };
}

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  author: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} as const;

function publishedArticleWhere() {
  return { status: "PUBLISHED" as const, publishedAt: { not: null, lte: new Date() } };
}

// --- Site settings ----------------------------------------------------------

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsDTO> => {
    const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      companyName: row.companyName,
      companyEmail: row.companyEmail,
      phone: row.phone,
      address: row.address,
      logoUrl: row.logoUrl,
      faviconUrl: row.faviconUrl,
      linkedinUrl: row.linkedinUrl,
      xUrl: row.xUrl,
      facebookUrl: row.facebookUrl,
      instagramUrl: row.instagramUrl,
      youtubeUrl: row.youtubeUrl,
      footerText: row.footerText,
      defaultSeoTitle: row.defaultSeoTitle,
      defaultSeoDescription: row.defaultSeoDescription,
      defaultOgImage: row.defaultOgImage,
    };
  },
  ["public:site-settings"],
  { tags: [CACHE_TAGS.site], revalidate: REVALIDATE_SECONDS },
);

// --- Homepage ---------------------------------------------------------------

export const getHomepage = unstable_cache(
  async (): Promise<HomepageDTO> => {
    const rows = await prisma.homepageSection.findMany({
      include: { items: { orderBy: { displayOrder: "asc" } } },
    });
    const result: HomepageDTO = {};
    for (const row of rows) {
      result[row.key] = {
        enabled: row.enabled,
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        image: row.image,
        primaryCtaLabel: row.primaryCtaLabel,
        primaryCtaHref: row.primaryCtaHref,
        secondaryCtaLabel: row.secondaryCtaLabel,
        secondaryCtaHref: row.secondaryCtaHref,
        items: row.items.map((i) => ({ title: i.title, body: i.body })),
      };
    }
    return result;
  },
  ["public:homepage"],
  { tags: [CACHE_TAGS.homepage], revalidate: REVALIDATE_SECONDS },
);

// --- Services ---------------------------------------------------------------

export const getPublishedServices = unstable_cache(
  async (): Promise<ServiceDTO[]> => (await findServiceRows({})).map(toService),
  ["public:services"],
  { tags: [CACHE_TAGS.services, CACHE_TAGS.industries], revalidate: REVALIDATE_SECONDS },
);

export const getFeaturedServices = unstable_cache(
  async (): Promise<ServiceDTO[]> => (await findServiceRows({ featured: true })).map(toService),
  ["public:services-featured"],
  { tags: [CACHE_TAGS.services, CACHE_TAGS.industries], revalidate: REVALIDATE_SECONDS },
);

export const getServiceBySlug = unstable_cache(
  async (slug: string): Promise<ServiceDTO | null> => {
    const rows = await findServiceRows({ slug });
    return rows[0] ? toService(rows[0]) : null;
  },
  ["public:service"],
  { tags: [CACHE_TAGS.services, CACHE_TAGS.industries], revalidate: REVALIDATE_SECONDS },
);

// --- Industries -------------------------------------------------------------

export const getPublishedIndustries = unstable_cache(
  async (): Promise<IndustryDTO[]> => (await findIndustryRows({})).map(toIndustry),
  ["public:industries"],
  { tags: [CACHE_TAGS.industries, CACHE_TAGS.services], revalidate: REVALIDATE_SECONDS },
);

export const getFeaturedIndustries = unstable_cache(
  async (): Promise<IndustryDTO[]> => (await findIndustryRows({ featured: true })).map(toIndustry),
  ["public:industries-featured"],
  { tags: [CACHE_TAGS.industries, CACHE_TAGS.services], revalidate: REVALIDATE_SECONDS },
);

export const getIndustryBySlug = unstable_cache(
  async (slug: string): Promise<IndustryDTO | null> => {
    const rows = await findIndustryRows({ slug });
    return rows[0] ? toIndustry(rows[0]) : null;
  },
  ["public:industry"],
  { tags: [CACHE_TAGS.industries, CACHE_TAGS.services], revalidate: REVALIDATE_SECONDS },
);

// --- Articles ---------------------------------------------------------------

function toArticleList(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  author: string;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
}): ArticleListDTO {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    featuredImage: row.featuredImage,
    author: row.author,
    category: row.category,
    publishedAt: (row.publishedAt ?? new Date()).toISOString(),
  };
}

export const getPublishedArticles = unstable_cache(
  async (limit: number = 60): Promise<ArticleListDTO[]> => {
    const rows = await prisma.article.findMany({
      where: publishedArticleWhere(),
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: articleSelect,
    });
    return rows.map(toArticleList);
  },
  ["public:articles"],
  { tags: [CACHE_TAGS.articles], revalidate: REVALIDATE_SECONDS },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<ArticleDTO | null> => {
    const row = await prisma.article.findFirst({
      where: { slug, ...publishedArticleWhere() },
      select: { ...articleSelect, content: true, seoTitle: true, seoDescription: true, updatedAt: true },
    });
    if (!row) return null;
    return {
      ...toArticleList(row),
      content: row.content,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      updatedAt: row.updatedAt.toISOString(),
    };
  },
  ["public:article"],
  { tags: [CACHE_TAGS.articles], revalidate: REVALIDATE_SECONDS },
);

export const getRelatedArticles = unstable_cache(
  async (excludeSlug: string): Promise<ArticleListDTO[]> => {
    const rows = await prisma.article.findMany({
      where: { ...publishedArticleWhere(), slug: { not: excludeSlug } },
      orderBy: { publishedAt: "desc" },
      take: 2,
      select: articleSelect,
    });
    return rows.map(toArticleList);
  },
  ["public:articles-related"],
  { tags: [CACHE_TAGS.articles], revalidate: REVALIDATE_SECONDS },
);

// --- Sitemap ----------------------------------------------------------------

export const getSitemapEntries = unstable_cache(
  async () => {
    const [services, industries, articles] = await Promise.all([
      prisma.service.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.industry.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({
        where: publishedArticleWhere(),
        select: { slug: true, updatedAt: true },
      }),
    ]);
    const iso = (rows: { slug: string; updatedAt: Date }[]) =>
      rows.map((r) => ({ slug: r.slug, updatedAt: r.updatedAt.toISOString() }));
    return { services: iso(services), industries: iso(industries), articles: iso(articles) };
  },
  ["public:sitemap"],
  { tags: [CACHE_TAGS.services, CACHE_TAGS.industries, CACHE_TAGS.articles], revalidate: 3600 },
);
