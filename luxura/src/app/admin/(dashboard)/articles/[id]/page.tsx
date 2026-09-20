import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, PageHeader } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/article-form";

export const metadata = { title: "Edit article" };

export default async function EditArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!article) notFound();
  return (
    <AdminContainer className="max-w-4xl">
      <PageHeader title={article.title} description={sp.created ? "Article created. You can keep editing it here." : undefined} />
      <ArticleForm
        categories={categories}
        defaultAuthor="Luxura Tech Team"
        article={{ ...article, publishedAt: article.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : null }}
      />
    </AdminContainer>
  );
}
