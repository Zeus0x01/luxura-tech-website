import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, EmptyState, PageHeader } from "@/components/admin/ui";
import { ContentTable } from "@/components/admin/content-table";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmForm } from "@/components/admin/form-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteArticle, deleteCategory, setArticleStatus } from "@/actions/articles";

export const metadata = { title: "Insights" };

export default async function ArticlesAdminPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({ orderBy: [{ createdAt: "desc" }], select: { id: true, title: true, slug: true, status: true } }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { articles: true } } } }),
  ]);
  return (
    <AdminContainer>
      <PageHeader
        title="Insights"
        description="Write, publish and unpublish articles. Drafts are never shown on the website."
        actions={<Button asChild variant="dark"><Link href="/admin/articles/new"><Plus /> New article</Link></Button>}
      />
      {articles.length === 0 ? (
        <EmptyState title="No articles yet." action={{ href: "/admin/articles/new", label: "Write the first article" }} />
      ) : (
        <ContentTable
          noun="article"
          basePath="/admin/articles"
          publicPath="/insights"
          rows={articles.map((a) => ({ id: a.id, title: a.title, subtitle: a.slug, status: a.status }))}
          actions={{ setStatus: setArticleStatus, remove: deleteArticle }}
        />
      )}

      <Card className="mt-10 max-w-xl">
        <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <ul className="divide-y divide-line">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">{c.name} <span className="text-muted">({c._count.articles})</span></span>
                <ConfirmForm action={deleteCategory} message={`Delete the category "${c.name}"? Its articles will simply have no category.`}>
                  <input type="hidden" name="id" value={c.id} />
                  <Button type="submit" variant="ghost" size="icon" aria-label={`Delete category ${c.name}`} className="text-red-600 hover:bg-red-50"><Trash2 /></Button>
                </ConfirmForm>
              </li>
            ))}
          </ul>
          <CategoryForm />
        </CardContent>
      </Card>
    </AdminContainer>
  );
}
