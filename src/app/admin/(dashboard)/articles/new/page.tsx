import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = { title: "New article" };

export default async function NewArticlePage() {
  const categories = await prisma.articleCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title="New article" />
      <ArticleForm categories={categories} defaultAuthor="Luxura Tech Team" />
    </AdminContainer>
  );
}
