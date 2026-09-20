import Link from "next/link";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { Button } from "@/components/ui/button";
import { getPublishedServices, getSiteSettings } from "@/lib/data/public";
import { DEFAULT_SETTINGS } from "@/lib/data/defaults";

export const metadata = { title: "Page not found", robots: { index: false } };

export default async function NotFound() {
  const [settings, services] = await Promise.all([
    getSiteSettings().catch(() => DEFAULT_SETTINGS),
    getPublishedServices().catch(() => []),
  ]);
  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main" className="bg-paper">
        <div className="container-page py-28 text-center sm:py-40">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-navy-600">Error 404</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-navy-950 sm:text-5xl">We couldn&apos;t find that page.</h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">It may have moved or no longer exists. Let&apos;s get you back on track.</p>
          <div className="mt-9 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} services={services} />
    </>
  );
}
