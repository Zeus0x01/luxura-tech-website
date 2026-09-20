import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getPublishedServices, getServiceBySlug, getSitemapEntries } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { Eyebrow, SectionHeading } from "@/components/public/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/public/json-ld";
import { ServiceCard } from "@/components/public/cards";
import { getIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/env";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { services } = await getSitemapEntries();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return []; // pages will render on demand and be cached
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };
  return buildMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.coverImage,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const others = (await getPublishedServices()).filter((s) => s.slug !== service.slug).slice(0, 3);
  const Icon = getIcon(service.icon);
  const paragraphs = service.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} subtitle={service.shortDescription} image={service.coverImage}>
        <Button asChild size="lg">
          <Link href={`/contact?service=${service.slug}`}>Request a Consultation</Link>
        </Button>
      </PageHero>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Overview" title={`What ${service.title} means for your organization`} />
            <span className="mt-8 inline-flex size-14 items-center justify-center rounded-xl bg-lime-400 text-navy-950">
              <Icon className="size-7" />
            </span>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {service.capabilities.length > 0 && (
        <section className="bg-paper py-20 sm:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Capabilities" title="Where we can help" />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3.5 rounded-xl border border-line bg-white p-5 shadow-card">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-lime-400 text-navy-950">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-medium text-navy-900">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {service.businessValue && (
        <section className="on-dark bg-navy-900 py-20 text-white sm:py-24">
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow tone="onDark">Business value</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">The value this brings to your business</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-white/75 lg:col-span-7">
              {service.businessValue
                .split(/\n{2,}/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </div>
        </section>
      )}

      {service.industries.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Related industries" title="Where this work applies" />
            <ul className="mt-8 flex flex-wrap gap-3">
              {service.industries.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/industries/${i.slug}`}
                    className="inline-flex items-center rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="bg-paper py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Explore more" title="Other services" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {others.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="on-dark relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Discuss {service.title.toLowerCase()} with our team.</h2>
            <p className="mt-4 text-lg text-white/65">Tell us about your goals and we will come back with a considered next step.</p>
          </div>
          <Button asChild size="lg">
            <Link href={`/contact?service=${service.slug}`}>Request a Consultation</Link>
          </Button>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.shortDescription,
          url: absoluteUrl(`/services/${service.slug}`),
          provider: { "@type": "Organization", name: "Luxura Tech USA LLC" },
        }}
      />
    </>
  );
}
