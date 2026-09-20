import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { ServiceCard } from "@/components/public/cards";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Technology solutions, automotive and transportation consulting, business strategy, and advertising and marketing from Luxura Tech USA LLC.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four practice areas, one integrated perspective."
        subtitle="Technology, automotive, strategy, and marketing work best when they are planned together. Explore how we can support your organization."
        image="/images/highway.jpg"
      />
      <section className="bg-paper py-20 sm:py-24">
        <div className="container-page">
          {services.length === 0 ? (
            <p className="rounded-xl border border-dashed border-navy-900/20 p-10 text-center text-muted">
              Our services are being updated. Please check back shortly, or get in touch directly.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
          <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-xl bg-navy-900 p-8 text-white sm:flex-row sm:items-center">
            <p className="font-display text-xl font-semibold">Not sure which service fits? Tell us what you are working on.</p>
            <Button asChild>
              <Link href="/contact">Request a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
