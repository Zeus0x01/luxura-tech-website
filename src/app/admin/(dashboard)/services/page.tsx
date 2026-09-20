import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, EmptyState, PageHeader } from "@/components/admin/ui";
import { ContentTable } from "@/components/admin/content-table";
import { Button } from "@/components/ui/button";
import { deleteService, moveService, setServiceStatus, toggleServiceFeatured } from "@/actions/services";

export const metadata = { title: "Services" };

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: [{ displayOrder: "asc" }, { title: "asc" }] });
  return (
    <AdminContainer>
      <PageHeader
        title="Services"
        description="Add, edit, reorder, feature, publish or remove services. Changes appear on the website immediately."
        actions={<Button asChild variant="dark"><Link href="/admin/services/new"><Plus /> New service</Link></Button>}
      />
      {services.length === 0 ? (
        <EmptyState title="No services yet." action={{ href: "/admin/services/new", label: "Create the first service" }} />
      ) : (
        <ContentTable
          noun="service"
          basePath="/admin/services"
          publicPath="/services"
          rows={services.map((s) => ({ id: s.id, title: s.title, subtitle: s.slug, status: s.status, featured: s.featured }))}
          actions={{ setStatus: setServiceStatus, remove: deleteService, toggleFeatured: toggleServiceFeatured, move: moveService }}
        />
      )}
    </AdminContainer>
  );
}
