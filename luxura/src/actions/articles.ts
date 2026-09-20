"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { articleSchema, categorySchema } from "@/lib/validation/content";
import { idSchema } from "@/lib/validation/leads";
import { parseForm, isUniqueViolation, type FormState } from "@/lib/admin/form";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";
import { describeError, log } from "@/lib/logger";

export async function saveArticle(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseForm(articleSchema, formData);
  if (!parsed.ok) return parsed.state;
  const data = parsed.data;

  let categoryId = data.categoryId;
  if (categoryId) {
    const exists = await prisma.articleCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!exists) categoryId = null;
  }

  let savedId = id;
  try {
    const existing = id ? await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
    // Stamp the publication date the first time an article goes live.
    const publishedAt =
      data.publishedAt ?? (data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null));

    const payload = { ...data, categoryId, publishedAt };
    if (id) {
      await prisma.article.update({ where: { id }, data: payload });
    } else {
      savedId = (await prisma.article.create({ data: payload })).id;
    }
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "This URL slug is already used by another article." } };
    }
    log.error("article_save_failed", describeError(err));
    return { ok: false, message: "The article could not be saved. Please try again." };
  }

  log.info("admin_article_saved", { adminId: admin.id, articleId: savedId, status: data.status });
  revalidatePublicContent("articles");
  if (!id) redirect(`/admin/articles/${savedId}?created=1`);
  return { ok: true, message: "Article saved." };
}

export async function deleteArticle(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.article.delete({ where: { id } });
  log.info("admin_article_deleted", { adminId: admin.id, articleId: id });
  revalidatePublicContent("articles");
  redirect("/admin/articles");
}

export async function setArticleStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!existing) return;
  await prisma.article.update({
    where: { id },
    data: { status, ...(status === "PUBLISHED" && !existing.publishedAt ? { publishedAt: new Date() } : {}) },
  });
  log.info("admin_article_status", { adminId: admin.id, articleId: id, status });
  revalidatePublicContent("articles");
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(categorySchema, formData);
  if (!parsed.ok) return parsed.state;
  const slug = slugify(parsed.data.name);
  if (!slug) return { ok: false, errors: { name: "Use letters or numbers in the name." } };
  try {
    await prisma.articleCategory.create({ data: { name: parsed.data.name, slug } });
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, errors: { name: "A category with this name already exists." } };
    log.error("category_create_failed", describeError(err));
    return { ok: false, message: "The category could not be saved." };
  }
  revalidatePublicContent("articles");
  return { ok: true, message: "Category added." };
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.articleCategory.delete({ where: { id } }); // articles keep existing, category set to null
  revalidatePublicContent("articles");
}
