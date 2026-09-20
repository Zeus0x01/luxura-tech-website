import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { DesktopNav, MobileNav } from "./site-nav";
import type { SiteSettingsDTO } from "@/lib/data/types";

export function SiteHeader({ settings }: { settings: SiteSettingsDTO }) {
  return (
    <header className="on-dark sticky top-0 z-50 border-b border-white/10 bg-navy-950/92 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" aria-label={`${settings.companyName} — home`} className="shrink-0">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.companyName} className="h-9 w-auto" />
          ) : (
            <Logo tone="onDark" className="h-8 lg:h-9" title={settings.companyName} />
          )}
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Request a Consultation</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
