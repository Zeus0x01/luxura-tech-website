import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, getSitemapEntries } from "@/lib/data/public";
import { Markdown } from "@/components/public/markdown";
import { CmsImage } from "@/components/public/cms-image";
import { ArticleCard } from "@/components/public/cards";
import { JsonLd } from "@/components/public/json-ld";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/public/section";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { articles } = await getSitemapEntries();
    return articles.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/insights/${article.slug}`,
    image: article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const related = await getRelatedArticles(article.slug);

  return (
    <>
      <header className="on-dark bg-navy-950 text-white">
        <div className="container-page max-w-4xl py-16 sm:py-24">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white">
            <ArrowLeft className="size-4" /> All insights
          </Link>
          <div className="mt-8">
            <Eyebrow tone="onDark">{article.category?.name ?? "Insight"}</Eyebrow>
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">{article.title}</h1>
          <p className="mt-6 text-lg text-white/70">{article.excerpt}</p>
          <p className="mt-6 text-sm text-white/55">
            {article.author} · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
        </div>
        <div aria-hidden className="h-1 bg-gradient-to-r from-lime-400 via-lime-400/40 to-transparent" />
      </header>

      <article className="bg-white py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          {article.featuredImage && (
            <div className="relative -mt-2 mb-12 aspect-[16/9] overflow-hidden rounded-xl shadow-card">
              <CmsImage src={article.featuredImage} alt="" fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
            </div>
          )}
          <Markdown>{article.content}</Markdown>
          <div className="mt-14 rounded-xl bg-navy-900 p-8 text-white">
            <p className="font-display text-xl font-semibold">Want to talk through how this applies to your business?</p>
            <Button asChild className="mt-5">
              <Link href="/contact">Request a Consultation</Link>
            </Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paper py-16">
          <div className="container-page">
            <h2 className="font-display text-2xl font-semibold text-navy-950">More insights</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: { "@type": "Person", name: article.author },
          mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
          ...(article.featuredImage?.startsWith("/") ? { image: absoluteUrl(article.featuredImage) } : {}),
        }}
      />
    </>
  );
}
