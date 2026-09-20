"use client";

import Link from "next/link";
import { saveArticle } from "@/actions/articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field, FormStatus, ImagePicker, StatusSelect, SubmitButton, useActionForm } from "./form-kit";

type Props = {
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    author: string;
    categoryId: string | null;
    status: "DRAFT" | "PUBLISHED";
    publishedAt: string | null; // YYYY-MM-DD
    seoTitle: string | null;
    seoDescription: string | null;
  };
  categories: { id: string; name: string }[];
  defaultAuthor: string;
};

export function ArticleForm({ article, categories, defaultAuthor }: Props) {
  const [state, onSubmit, pending] = useActionForm(saveArticle.bind(null, article?.id ?? null));
  const e = state?.errors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormStatus state={state} />
      <Card>
        <CardHeader>
          <CardTitle>Article</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" name="title" error={e.title} className="sm:col-span-2">
            <Input id="title" name="title" defaultValue={article?.title} required maxLength={190} aria-invalid={!!e.title} />
          </Field>
          <Field label="URL slug" name="slug" error={e.slug} hint="Appears in the address: /insights/your-slug">
            <Input id="slug" name="slug" defaultValue={article?.slug} required maxLength={100} aria-invalid={!!e.slug} />
          </Field>
          <Field label="Author" name="author" error={e.author}>
            <Input id="author" name="author" defaultValue={article?.author ?? defaultAuthor} required maxLength={120} />
          </Field>
          <Field label="Excerpt" name="excerpt" error={e.excerpt} className="sm:col-span-2" hint="A short summary shown on cards and under the title.">
            <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={article?.excerpt} required maxLength={600} aria-invalid={!!e.excerpt} />
          </Field>
          <Field
            label="Content"
            name="content"
            error={e.content}
            className="sm:col-span-2"
            hint="Markdown: ## Heading, **bold**, *italic*, - list items, [link](https://…). Raw HTML and images are not rendered."
          >
            <Textarea id="content" name="content" rows={18} defaultValue={article?.content} required className="font-mono text-sm leading-relaxed" aria-invalid={!!e.content} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <StatusSelect defaultValue={article?.status ?? "DRAFT"} />
          <Field label="Publication date" name="publishedAt" error={e.publishedAt} hint="Set automatically when first published. A future date hides the article until then.">
            <Input id="publishedAt" name="publishedAt" type="date" defaultValue={article?.publishedAt ?? ""} />
          </Field>
          <Field label="Category" name="categoryId">
            <Select id="categoryId" name="categoryId" defaultValue={article?.categoryId ?? ""}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <ImagePicker name="featuredImage" label="Featured image" defaultValue={article?.featuredImage} error={e.featuredImage} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search engine listing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field label="SEO title" name="seoTitle" error={e.seoTitle} hint="Leave empty to use the article title.">
            <Input id="seoTitle" name="seoTitle" defaultValue={article?.seoTitle ?? ""} maxLength={190} />
          </Field>
          <Field label="SEO description" name="seoDescription" error={e.seoDescription} hint="Leave empty to use the excerpt.">
            <Textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={article?.seoDescription ?? ""} maxLength={320} />
          </Field>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton pending={pending} variant="dark" size="lg">
          {article ? "Save changes" : "Create article"}
        </SubmitButton>
        <Button asChild variant="ghost" size="lg">
          <Link href="/admin/articles">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
