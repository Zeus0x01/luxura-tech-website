import type { Metadata } from "next";
import Link from "next/link";
import { getHomepage, getPublishedServices } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { Eyebrow, SectionHeading } from "@/components/public/section";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/public/cms-image";
import { getIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Luxura Tech USA LLC combines technology, automotive expertise, and business consulting, led by a CEO with over 25 years of international experience in management, consulting, and marketing.",
  path: "/about",
  image: "/images/skyline.jpg",
});

const APPROACH = [
  ["Start with the problem", "Every engagement begins with what your organization is actually trying to achieve, not with a predetermined solution."],
  ["Connect the disciplines", "Technology, automotive know-how, strategy, and marketing inform one another. We plan them together."],
  ["Customize the strategy", "We shape recommendations around your market, your constraints, and your people rather than applying a template."],
  ["Focus on efficiency and growth", "The aim is practical improvement: better performance today and a stronger position for what comes next."],
] as const;

export default async function AboutPage() {
  const [services, home] = await Promise.all([getPublishedServices(), getHomepage()]);
  const about = home.ABOUT;

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Technology, automotive expertise, and business consulting — together."
        subtitle="At Luxura Tech USA LLC, we combine technology, automotive expertise, and business consulting to deliver innovative solutions for today's global market."
        image="/images/skyline.jpg"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Company overview" title="A practice built across disciplines." />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
            <p>
              Luxura Tech USA LLC helps organizations improve performance, adapt to change, and grow in competitive markets. Our work brings together
              technology, automotive and transportation expertise, business strategy, and marketing.
            </p>
            <p>
              {about?.body?.split(/\n{2,}/)[1] ??
                "The work is practical. Engagements are scoped to the problem at hand and shaped around the organization we are working with."}
            </p>
          </div>
        </div>
      </section>

      <section className="on-dark relative isolate overflow-hidden bg-navy-900 py-20 text-white sm:py-28">
        <CmsImage src="/images/office.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/60" />
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow tone="onDark">Leadership</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Over 25 years of international experience.</h2>
          </div>
          <blockquote className="border-l-4 border-lime-400 pl-6 font-display text-2xl font-medium leading-snug text-white/90 lg:col-span-7 lg:text-[1.75rem]">
            With over 25 years of international experience in management, consulting, and marketing, our CEO has built a company that reflects
            excellence, vision, and trust.
          </blockquote>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Our approach" title="How we work." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {APPROACH.map(([title, text], i) => (
              <div key={title} className="bg-white p-8">
                <span className="font-display text-3xl font-semibold text-navy-900/25">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-navy-950">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading eyebrow="Core capabilities" title="Four practice areas." />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {services.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex h-full gap-5 rounded-xl border border-line bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                    >
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-navy-950">
                        <Icon className="size-6" />
                      </span>
                      <span>
                        <span className="block font-display text-lg font-semibold text-navy-950 group-hover:text-brand">{s.title}</span>
                        <span className="mt-2 block text-[15px] leading-relaxed text-muted">{s.shortDescription}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="International perspective" title="Reading markets beyond borders." />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
            <p>
              Today&apos;s markets are connected, and so are the challenges organizations face. Our leadership&apos;s international experience shapes
              how we read markets, weigh options, and plan for growth.
            </p>
            <p>
              We bring a cross-industry view to each engagement, connecting what we see in technology, transportation, and commerce to the specific
              situation in front of us.
            </p>
          </div>
        </div>
      </section>

      <section className="on-dark bg-navy-950 py-20 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Let&apos;s discuss what you are working toward.</h2>
          <Button asChild size="lg">
            <Link href="/contact">Request a Consultation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
