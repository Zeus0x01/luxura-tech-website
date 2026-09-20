import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { JsonLd } from "@/components/public/json-ld";
import { getPublishedServices, getSiteSettings } from "@/lib/data/public";
import { absoluteUrl } from "@/lib/env";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublishedServices()]);

  const sameAs = [settings.linkedinUrl, settings.xUrl, settings.facebookUrl, settings.instagramUrl, settings.youtubeUrl].filter(Boolean);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-lime-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-950"
      >
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} services={services} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings.companyName,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/icon.svg"),
          ...(settings.companyEmail ? { email: settings.companyEmail } : {}),
          ...(settings.phone ? { telephone: settings.phone } : {}),
          ...(sameAs.length ? { sameAs } : {}),
        }}
      />
    </>
  );
}
