import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { prisma } from "@/lib/db/prisma";
import { DEFAULT_SETTINGS } from "@/lib/data/defaults";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  const { id: _id, createdAt: _c, updatedAt: _u, ...settings } = row ?? { id: "", createdAt: null, updatedAt: null, ...DEFAULT_SETTINGS };
  void _id; void _c; void _u;
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title="Site settings" description="Company details, branding, social links and default SEO. Changes go live immediately." />
      <SettingsForm settings={settings} />
    </AdminContainer>
  );
}
