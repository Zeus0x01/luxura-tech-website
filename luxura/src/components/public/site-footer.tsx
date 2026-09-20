import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./social-icons";
import type { ServiceDTO, SiteSettingsDTO } from "@/lib/data/types";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({ settings, services }: { settings: SiteSettingsDTO; services: Pick<ServiceDTO, "title" | "slug">[] }) {
  const socials = [
    { href: settings.linkedinUrl, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.xUrl, label: "X", Icon: XIcon },
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YouTubeIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof XIcon } => Boolean(s.href));

  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-white/70">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[0.035]">
        <Logo markOnly tone="onDark" className="h-full w-full" />
      </div>
      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="onDark" className="h-10" title={settings.companyName} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            {settings.footerText || "Technology, automotive, and business solutions."}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-lime-400">Technology. Mobility. Strategy.</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-lime-400 hover:text-lime-400"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {settings.companyEmail && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 size-4 shrink-0 text-lime-400" />
                  <a href={`mailto:${settings.companyEmail}`} className="break-all hover:text-white">
                    {settings.companyEmail}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-lime-400" />
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-lime-400" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              <li>
                <Link href="/contact" className="font-semibold text-lime-400 hover:text-lime-300">
                  Request a Consultation →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
