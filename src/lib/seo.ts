import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/env";
import { truncate } from "@/lib/utils";

type MetaInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  noIndex?: boolean;
};

/** Page-level metadata: title, description, canonical URL and Open Graph. */
export function buildMetadata(input: MetaInput): Metadata {
  const description = input.description ? truncate(input.description, 200) : undefined;
  const url = absoluteUrl(input.path);
  const images = input.image ? [{ url: input.image }] : undefined;

  return {
    title: input.title,
    description,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: input.title,
      description,
      url,
      type: input.type ?? "website",
      ...(images ? { images } : {}),
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime ?? undefined, modifiedTime: input.modifiedTime ?? undefined }
        : {}),
    },
    twitter: { title: input.title, description, ...(images ? { images: [input.image!] } : {}) },
  };
}
