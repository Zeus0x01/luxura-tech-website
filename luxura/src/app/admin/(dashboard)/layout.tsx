import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { AdminSidebar } from "@/components/admin/sidebar";
import { logoutAction } from "@/actions/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side gate: nothing under /admin renders without a valid admin.
  const admin = await requireAdmin();
  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

  return (
    <AdminSidebar user={{ name: admin.name, email: admin.email }} newLeads={newLeads} logout={logoutAction}>
      {children}
    </AdminSidebar>
  );
}
