"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { industrySchema } from "@/lib/validation/content";
import { idSchema } from "@/lib/validation/leads";
import { parseForm, isUniqueViolation, type FormState } from "@/lib/admin/form";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { describeError, log } from "@/lib/logger";

export async function saveIndustry(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseForm(industrySchema, formData);
  if (!parsed.ok) return parsed.state;
  const data = parsed.data;

  let savedId = id;
  try {
    if (id) {
      await prisma.industry.update({ where: { id }, data });
    } else {
      const last = await prisma.industry.aggregate({ _max: { displayOrder: true } });
      const created = await prisma.industry.create({ data: { ...data, displayOrder: (last._max.displayOrder ?? 0) + 1 } });
      savedId = created.id;
    }
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "This URL slug is already used by another industry." } };
    }
    log.error("industry_save_failed", describeError(err));
    return { ok: false, message: "The industry could not be saved. Please try again." };
  }

  log.info("admin_industry_saved", { adminId: admin.id, industryId: savedId, status: data.status });
  revalidatePublicContent("industries", "homepage");
  if (!id) redirect(`/admin/industries/${savedId}?created=1`);
  return { ok: true, message: "Industry saved." };
}

export async function deleteIndustry(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.industry.delete({ where: { id } });
  log.info("admin_industry_deleted", { adminId: admin.id, industryId: id });
  revalidatePublicContent("industries", "homepage");
  redirect("/admin/industries");
}

export async function setIndustryStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  await prisma.industry.update({ where: { id }, data: { status } });
  log.info("admin_industry_status", { adminId: admin.id, industryId: id, status });
  revalidatePublicContent("industries", "homepage");
}

export async function toggleIndustryFeatured(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const current = await prisma.industry.findUnique({ where: { id }, select: { featured: true } });
  if (!current) return;
  await prisma.industry.update({ where: { id }, data: { featured: !current.featured } });
  revalidatePublicContent("industries", "homepage");
}

export async function moveIndustry(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const all = await prisma.industry.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { id: true } });
  const from = all.findIndex((s) => s.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= all.length) return;
  [all[from], all[to]] = [all[to]!, all[from]!];

  await prisma.$transaction(all.map((s, i) => prisma.industry.update({ where: { id: s.id }, data: { displayOrder: i + 1 } })));
  revalidatePublicContent("industries", "homepage");
}
