import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { IndustryForm } from "@/components/admin/industry-form";

export const metadata = { title: "Edit industry" };

export default async function EditIndustryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const industry = await prisma.industry.findUnique({ where: { id } });
  if (!industry) notFound();
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title={industry.name} description={sp.created ? "Industry created. You can keep editing it here." : undefined} />
      <IndustryForm industry={industry} />
    </AdminContainer>
  );
}
