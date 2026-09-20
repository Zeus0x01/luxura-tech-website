import { Logo } from "./logo";
import { CmsImage } from "./cms-image";
import { Eyebrow } from "./section";

/** Dark hero band used by inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-white">
      {image && (
        <>
          <CmsImage src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        </>
      )}
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-16 -z-10 hidden h-[460px] w-[460px] opacity-[0.05] md:block">
        <Logo markOnly tone="onDark" className="h-full w-full" />
      </div>
      <div className="container-page py-20 sm:py-28">
        {eyebrow && <Eyebrow tone="onDark">{eyebrow}</Eyebrow>}
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{subtitle}</p>}
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </div>
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-lime-400 via-lime-400/40 to-transparent" />
    </section>
  );
}
