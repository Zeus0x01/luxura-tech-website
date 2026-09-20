import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { HomepageSectionForm, type SectionFormProps } from "@/components/admin/homepage-section-form";
import type { HomepageKey } from "@/lib/validation/homepage";

export const metadata = { title: "Homepage" };

type Def = { key: HomepageKey; label: string; help: string; show: SectionFormProps["show"] };

const SECTIONS: Def[] = [
  { key: "HERO", label: "Hero", help: "The first screen visitors see.", show: { image: true, primaryCta: true, secondaryCta: true } },
  { key: "ABOUT", label: "About section", help: "Company introduction below the hero.", show: { body: true, image: true, primaryCta: true } },
  { key: "SERVICES", label: "Core services", help: "Heading for the services grid, plus which services are featured.", show: {} },
  { key: "HOW_WE_HELP", label: "How we help", help: "Numbered steps describing the process.", show: { body: true, items: true } },
  { key: "INDUSTRIES", label: "Industries", help: "Heading for the industries grid, plus which industries are featured.", show: {} },
  { key: "WHY_LUXURA", label: "Why Luxura", help: "Reasons to work with the company.", show: { body: true, items: true } },
  { key: "FINAL_CTA", label: "Final call to action", help: "Closing section above the footer.", show: { body: true, image: true, primaryCta: true, secondaryCta: true } },
];

export default async function HomepageAdminPage() {
  const [sections, services, industries] = await Promise.all([
    prisma.homepageSection.findMany({ include: { items: { orderBy: { displayOrder: "asc" } } } }),
    prisma.service.findMany({ orderBy: { displayOrder: "asc" }, select: { id: true, title: true, featured: true, status: true } }),
    prisma.industry.findMany({ orderBy: { displayOrder: "asc" }, select: { id: true, name: true, featured: true, status: true } }),
  ]);
  const byKey = new Map(sections.map((s) => [s.key, s]));

  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title="Homepage" description="Edit every section of the homepage. Each section saves on its own and goes live immediately." />
      <div className="space-y-6">
        {SECTIONS.map((def) => {
          const s = byKey.get(def.key);
          const featured =
            def.key === "SERVICES"
              ? { label: "Featured services", options: services.map((x) => ({ id: x.id, name: x.status === "PUBLISHED" ? x.title : `${x.title} (draft)`, checked: x.featured })) }
              : def.key === "INDUSTRIES"
                ? { label: "Featured industries", options: industries.map((x) => ({ id: x.id, name: x.status === "PUBLISHED" ? x.name : `${x.name} (draft)`, checked: x.featured })) }
                : undefined;
          return (
            <HomepageSectionForm
              key={def.key}
              sectionKey={def.key}
              label={def.label}
              help={def.help}
              show={def.show}
              featured={featured}
              values={{
                enabled: s?.enabled ?? true,
                title: s?.title ?? "",
                subtitle: s?.subtitle ?? "",
                body: s?.body ?? "",
                image: s?.image ?? "",
                primaryCtaLabel: s?.primaryCtaLabel ?? "",
                primaryCtaHref: s?.primaryCtaHref ?? "",
                secondaryCtaLabel: s?.secondaryCtaLabel ?? "",
                secondaryCtaHref: s?.secondaryCtaHref ?? "",
                items: s?.items.map((i) => ({ title: i.title, body: i.body })) ?? [],
              }}
            />
          );
        })}
      </div>
    </AdminContainer>
  );
}
