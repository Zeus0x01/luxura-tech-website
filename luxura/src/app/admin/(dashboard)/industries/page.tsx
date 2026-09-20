import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, EmptyState, PageHeader } from "@/components/admin/ui";
import { ContentTable } from "@/components/admin/content-table";
import { Button } from "@/components/ui/button";
import { deleteIndustry, moveIndustry, setIndustryStatus, toggleIndustryFeatured } from "@/actions/industries";

export const metadata = { title: "Industries" };

export default async function IndustriesAdminPage() {
  const industries = await prisma.industry.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
  return (
    <AdminContainer>
      <PageHeader
        title="Industries"
        description="Manage the industries shown on the website."
        actions={<Button asChild variant="dark"><Link href="/admin/industries/new"><Plus /> New industry</Link></Button>}
      />
      {industries.length === 0 ? (
        <EmptyState title="No industries yet." action={{ href: "/admin/industries/new", label: "Create the first industry" }} />
      ) : (
        <ContentTable
          noun="industry"
          basePath="/admin/industries"
          publicPath="/industries"
          rows={industries.map((s) => ({ id: s.id, title: s.name, subtitle: s.slug, status: s.status, featured: s.featured }))}
          actions={{ setStatus: setIndustryStatus, remove: deleteIndustry, toggleFeatured: toggleIndustryFeatured, move: moveIndustry }}
        />
      )}
    </AdminContainer>
  );
}
