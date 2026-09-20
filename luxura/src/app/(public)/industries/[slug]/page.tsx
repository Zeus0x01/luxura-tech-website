import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getSitemapEntries } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { industries } = await getSitemapEntries();
    return industries.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return { title: "Industry not found", robots: { index: false } };
  return buildMetadata({
    title: industry.seoTitle || industry.name,
    description: industry.seoDescription || industry.description,
    path: `/industries/${industry.slug}`,
    image: industry.image,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const paragraphs = industry.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <PageHero eyebrow="Industry" title={industry.name} subtitle={paragraphs[0]} image={industry.image}>
        <Button asChild size="lg">
          <Link href="/contact">Request a Consultation</Link>
        </Button>
      </PageHero>

      {(paragraphs.length > 1 || industry.services.length > 0) && (
        <section className="bg-white py-20 sm:py-24">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            {paragraphs.length > 1 && (
              <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
                {paragraphs.slice(1).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {industry.services.length > 0 && (
              <div className={paragraphs.length > 1 ? "lg:col-span-5" : "lg:col-span-12"}>
                <SectionHeading eyebrow="Related services" title="How we support this sector" as="h2" />
                <ul className="mt-8 space-y-3">
                  {industry.services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 font-semibold shadow-card transition-all hover:-translate-y-0.5 hover:border-navy-900"
                      >
                        {s.title}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
