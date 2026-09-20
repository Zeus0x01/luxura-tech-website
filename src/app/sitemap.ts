import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/env";
import { getSitemapEntries } from "@/lib/data/public";
import { log, describeError } from "@/lib/logger";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/industries"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const { services, industries, articles } = await getSitemapEntries();
    return [
      ...staticPages,
      ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt, priority: 0.8 })),
      ...industries.map((s) => ({ url: absoluteUrl(`/industries/${s.slug}`), lastModified: s.updatedAt, priority: 0.6 })),
      ...articles.map((s) => ({ url: absoluteUrl(`/insights/${s.slug}`), lastModified: s.updatedAt, priority: 0.6 })),
    ];
  } catch (err) {
    log.error("sitemap_failed", describeError(err));
    return staticPages;
  }
}
