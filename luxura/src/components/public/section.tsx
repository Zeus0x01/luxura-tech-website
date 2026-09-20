import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small lime bar + uppercase label, echoing the brand deck's headings. */
export function Eyebrow({ children, tone = "onLight", className }: { children: React.ReactNode; tone?: "onLight" | "onDark"; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]", tone === "onDark" ? "text-white/70" : "text-navy-600", className)}>
      <span aria-hidden className="h-1 w-8 rounded-full bg-lime-400 ring-1 ring-lime-500/30" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "onLight",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  tone?: "onLight" | "onDark";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && eyebrow.trim().toLowerCase() !== title.trim().toLowerCase() && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "mt-4 font-display text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[2.75rem]",
          tone === "onDark" ? "text-white" : "text-navy-950",
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "onDark" ? "text-white/70" : "text-muted")}>{subtitle}</p>
      )}
    </div>
  );
}

export function TextLink({ href, children, tone = "onLight" }: { href: string; children: React.ReactNode; tone?: "onLight" | "onDark" }) {
  const cls = cn(
    "group inline-flex items-center gap-2 text-sm font-semibold",
    tone === "onDark" ? "text-lime-400 hover:text-lime-300" : "text-navy-900 hover:text-brand",
  );
  const arrow = <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />;
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
      {arrow}
    </a>
  );
}

/** Render a CMS-controlled href (internal path, https URL, mailto, tel) safely. */
export function CtaLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("https://");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
