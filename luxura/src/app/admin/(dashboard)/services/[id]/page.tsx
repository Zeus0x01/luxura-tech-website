import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [service, industries] = await Promise.all([
    prisma.service.findUnique({ where: { id }, include: { industries: { select: { industryId: true } } } }),
    prisma.industry.findMany({ orderBy: { displayOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!service) notFound();

  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title={service.title} description={sp.created ? "Service created. You can keep editing it here." : undefined} />
      <ServiceForm
        industries={industries}
        service={{ ...service, industryIds: service.industries.map((i) => i.industryId) }}
      />
    </AdminContainer>
  );
}
