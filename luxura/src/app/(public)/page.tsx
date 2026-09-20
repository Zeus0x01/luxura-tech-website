import Link from "next/link";
import { Check } from "lucide-react";
import { getFeaturedIndustries, getFeaturedServices, getHomepage, getSiteSettings } from "@/lib/data/public";
import type { HomepageSectionDTO } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/public/cms-image";
import { Logo } from "@/components/public/logo";
import { CtaLink, Eyebrow, SectionHeading, TextLink } from "@/components/public/section";
import { IndustryTile, ServiceCard } from "@/components/public/cards";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    ...buildMetadata({
      title: settings.defaultSeoTitle || settings.companyName,
      description: settings.defaultSeoDescription,
      path: "/",
      image: settings.defaultOgImage || "/og-default.jpg",
    }),
    title: { absolute: settings.defaultSeoTitle || settings.companyName },
  };
}

function paragraphs(text: string | null | undefined) {
  return (text ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

function industrySpan(index: number, total: number): string {
  if (index < 2) return "md:col-span-3";
  const rest = total - 2;
  if (rest === 1) return "md:col-span-6";
  if (rest === 2) return "md:col-span-3";
  return "md:col-span-2";
}

export default async function HomePage() {
  const [home, services, industries] = await Promise.all([getHomepage(), getFeaturedServices(), getFeaturedIndustries()]);
  const { HERO: hero, ABOUT: about, SERVICES: servicesSection, HOW_WE_HELP: how, INDUSTRIES: industriesSection, WHY_LUXURA: why, FINAL_CTA: cta } = home;

  return (
    <>
      {hero?.enabled !== false && hero && <Hero hero={hero} serviceNames={services.map((s) => ({ title: s.title, slug: s.slug }))} />}

      {about?.enabled && about.title && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-5">
              <SectionHeading eyebrow="The firm" title={about.title} subtitle={about.subtitle} />
              {about.image && (
                <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-xl shadow-card lg:block">
                  <CmsImage src={about.image} alt="" fill sizes="40vw" className="object-cover" />
                  <div aria-hidden className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-lime-400" />
                </div>
              )}
            </div>
            <div className="reveal lg:col-span-7 lg:pt-3">
              {paragraphs(about.body).map((p, i) => (
                <p key={i} className={i === 0 ? "font-display text-2xl font-medium leading-snug text-navy-950 sm:text-[1.7rem]" : "mt-6 text-lg leading-relaxed text-muted"}>
                  {p}
                </p>
              ))}
              {about.primaryCtaLabel && about.primaryCtaHref && (
                <div className="mt-9">
                  <TextLink href={about.primaryCtaHref}>{about.primaryCtaLabel}</TextLink>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {servicesSection?.enabled && services.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <div className="container-page">
            <div className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="What we do" title={servicesSection.title ?? "Core services"} subtitle={servicesSection.subtitle} />
              <TextLink href="/services">All services</TextLink>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div key={service.id} className="reveal">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {how?.enabled && how.items.length > 0 && (
        <section className="on-dark relative isolate overflow-hidden bg-navy-900 py-20 text-white sm:py-28">
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 -z-10 h-[520px] w-[520px] opacity-[0.045]">
            <Logo markOnly tone="onDark" className="h-full w-full" />
          </div>
          <div className="container-page">
            <div className="reveal">
              <SectionHeading eyebrow="Our approach" tone="onDark" title={how.title ?? "How we help"} subtitle={how.subtitle} />
              {how.body && <p className="mt-4 max-w-2xl text-white/60">{how.body}</p>}
            </div>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {how.items.map((item, i) => (
                <li key={item.title} className="reveal bg-navy-900 p-7 transition-colors hover:bg-navy-800">
                  <span className="font-display text-4xl font-semibold text-lime-400">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/65">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {industriesSection?.enabled && industries.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-page">
            <div className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Where we work" title={industriesSection.title ?? "Industries"} subtitle={industriesSection.subtitle} />
              <TextLink href="/industries">All industries</TextLink>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-6">
              {industries.map((industry, i) => (
                <IndustryTile
                  key={industry.id}
                  industry={industry}
                  tall={i < 2}
                  className={`reveal sm:col-span-1 ${industrySpan(i, industries.length)}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {why?.enabled && why.items.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <div className="reveal lg:sticky lg:top-28">
                <SectionHeading eyebrow="The Luxura difference" title={why.title ?? "Why Luxura"} subtitle={why.subtitle} />
                {why.body && <p className="mt-5 text-muted leading-relaxed">{why.body}</p>}
                <Button asChild variant="dark" size="lg" className="mt-9">
                  <Link href="/contact">Request a Consultation</Link>
                </Button>
              </div>
            </div>
            <ul className="divide-y divide-line lg:col-span-7">
              {why.items.map((item) => (
                <li key={item.title} className="reveal flex gap-5 py-7 first:pt-0">
                  <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-lime-400 text-navy-950">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-950">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {cta?.enabled && cta.title && <FinalCta cta={cta} />}
    </>
  );
}

function Hero({ hero, serviceNames }: { hero: HomepageSectionDTO; serviceNames: { title: string; slug: string }[] }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-white">
      {hero.image && (
        <CmsImage src={hero.image} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[65%_center] opacity-90" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
      {/* Angled lime edge, taken from the brand's diagonal panels */}
      <div aria-hidden className="absolute -right-24 bottom-0 top-0 -z-10 hidden w-40 -skew-x-[14deg] bg-lime-400/90 lg:block" />
      <div aria-hidden className="absolute -right-6 bottom-0 top-0 -z-10 hidden w-3 -skew-x-[14deg] bg-lime-400/40 lg:block" />

      <div className="container-page py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <Eyebrow tone="onDark">Technology · Mobility · Strategy</Eyebrow>
          <h1 className="mt-6 font-display text-[2.4rem] font-semibold leading-[1.06] sm:text-5xl lg:text-[4.1rem]">{hero.title}</h1>
          {hero.subtitle && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/72 sm:text-xl">{hero.subtitle}</p>}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {hero.primaryCtaLabel && hero.primaryCtaHref && (
              <Button asChild size="lg">
                <CtaLink href={hero.primaryCtaHref}>{hero.primaryCtaLabel}</CtaLink>
              </Button>
            )}
            {hero.secondaryCtaLabel && hero.secondaryCtaHref && (
              <Button asChild size="lg" variant="outlineLight">
                <CtaLink href={hero.secondaryCtaHref}>{hero.secondaryCtaLabel}</CtaLink>
              </Button>
            )}
          </div>
        </div>
      </div>

      {serviceNames.length > 0 && (
        <div className="border-t border-white/10 bg-navy-950/60 backdrop-blur-sm">
          <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-3 py-5 text-sm font-medium text-white/70 lg:grid-cols-4">
            {serviceNames.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                  <span aria-hidden className="size-1.5 rounded-full bg-lime-400" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function FinalCta({ cta }: { cta: HomepageSectionDTO }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      {cta.image && <CmsImage src={cta.image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/60" />
      <div aria-hidden className="absolute -left-20 bottom-0 top-0 -z-10 hidden w-6 skew-x-[14deg] bg-lime-400 md:block" />
      <div className="container-page">
        <div className="reveal max-w-3xl">
          <Eyebrow tone="onDark">Next step</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">{cta.title}</h2>
          {cta.subtitle && <p className="mt-5 text-xl text-white/80">{cta.subtitle}</p>}
          {cta.body && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">{cta.body}</p>}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {cta.primaryCtaLabel && cta.primaryCtaHref && (
              <Button asChild size="lg">
                <CtaLink href={cta.primaryCtaHref}>{cta.primaryCtaLabel}</CtaLink>
              </Button>
            )}
            {cta.secondaryCtaLabel && cta.secondaryCtaHref && (
              <Button asChild size="lg" variant="outlineLight">
                <CtaLink href={cta.secondaryCtaHref}>{cta.secondaryCtaLabel}</CtaLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
