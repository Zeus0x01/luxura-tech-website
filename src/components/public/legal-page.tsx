import { PageHero } from "./page-hero";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} subtitle={`Last updated ${updated}`} />
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <div className="prose-lux [&_h2]:mt-10">{children}</div>
        </div>
      </section>
    </>
  );
}
