import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { IndustryForm } from "@/components/admin/industry-form";

export const metadata = { title: "New industry" };

export default function NewIndustryPage() {
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title="New industry" />
      <IndustryForm />
    </AdminContainer>
  );
}
