import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedIndustries } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { IndustryTile } from "@/components/public/cards";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "Luxura Tech USA LLC works across automotive and mobility, transportation, technology, business services, and consumer and commercial businesses.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getPublishedIndustries();
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="A cross-industry perspective."
        subtitle="Experience across sectors where technology, mobility, and commercial strategy meet."
        image="/images/freeway.jpg"
      />
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          {industries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-navy-900/20 p-10 text-center text-muted">Industry information is being updated.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <IndustryTile key={industry.id} industry={industry} tall />
              ))}
            </div>
          )}
          <div className="mt-14 text-center">
            <Button asChild size="lg" variant="dark">
              <Link href="/contact">Request a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
