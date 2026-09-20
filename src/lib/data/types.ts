// Public DTOs. These are the ONLY shapes public pages receive, so private
// fields (leads, notes, drafts, users) can never reach a public render.

export type SiteSettingsDTO = {
  companyName: string;
  companyEmail: string | null;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  footerText: string | null;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  defaultOgImage: string | null;
};

export type IndustryRef = { id: string; name: string; slug: string };
export type ServiceRef = { id: string; title: string; slug: string };

export type ServiceDTO = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
  businessValue: string | null;
  icon: string | null;
  coverImage: string | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
  industries: IndustryRef[];
};

export type IndustryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
  services: ServiceRef[];
};

export type ArticleListDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  author: string;
  category: { name: string; slug: string } | null;
  publishedAt: string;
};

export type ArticleDTO = ArticleListDTO & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
};

export type HomepageSectionDTO = {
  enabled: boolean;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image: string | null;
  primaryCtaLabel: string | null;
  primaryCtaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  items: { title: string; body: string }[];
};

export type HomepageDTO = Partial<
  Record<"HERO" | "ABOUT" | "SERVICES" | "HOW_WE_HELP" | "INDUSTRIES" | "WHY_LUXURA" | "FINAL_CTA", HomepageSectionDTO>
>;
