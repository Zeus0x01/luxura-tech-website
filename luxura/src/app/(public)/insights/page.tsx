import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { ArticleCard } from "@/components/public/cards";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description: "Perspectives on technology, mobility, strategy, and marketing from Luxura Tech USA LLC.",
  path: "/insights",
});

export default async function InsightsPage() {
  const articles = await getPublishedArticles();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Perspectives on technology, mobility, and growth."
        subtitle="Practical thinking for leaders navigating change."
        image="/images/skyline.jpg"
      />
      <section className="bg-paper py-20 sm:py-24">
        <div className="container-page">
          {articles.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-xl border border-dashed border-navy-900/20 bg-white p-10 text-center">
              <h2 className="font-display text-xl font-semibold text-navy-950">New insights are on the way.</h2>
              <p className="mt-3 text-muted">We are preparing our first articles. In the meantime, we would be glad to hear about what you are working on.</p>
              <Button asChild className="mt-6" variant="dark">
                <Link href="/contact">Request a Consultation</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
