import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  const industries = await prisma.industry.findMany({ orderBy: { displayOrder: "asc" }, select: { id: true, name: true } });
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title="New service" />
      <ServiceForm industries={industries} />
    </AdminContainer>
  );
}
