"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      {LINKS.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
              active ? "text-white" : "text-white/65 hover:text-white",
            )}
          >
            {l.label}
            <span
              className={cn(
                "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-lime-400 transition-transform duration-300",
                active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="on-dark inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/10"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="on-dark fixed inset-x-0 top-16 z-50 h-[calc(100dvh-4rem)] overflow-y-auto bg-navy-950 px-5 pb-10 pt-4"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-white/10 py-4 font-display text-2xl font-semibold tracking-tight",
                    active ? "text-lime-400" : "text-white",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/contact"
            className="mt-8 flex h-13 items-center justify-center rounded-md bg-lime-400 text-base font-semibold text-navy-950"
          >
            Request a Consultation
          </Link>
        </div>
      )}
    </div>
  );
}
