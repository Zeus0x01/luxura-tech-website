"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { serviceSchema } from "@/lib/validation/content";
import { idSchema } from "@/lib/validation/leads";
import { parseForm, isUniqueViolation, type FormState } from "@/lib/admin/form";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { describeError, log } from "@/lib/logger";

export async function saveService(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseForm(serviceSchema, formData, ["industryIds"]);
  if (!parsed.ok) return parsed.state;
  const { industryIds, ...data } = parsed.data;

  let savedId = id;
  try {
    const links = industryIds.map((industryId: string) => ({ industryId }));
    if (id) {
      await prisma.service.update({
        where: { id },
        data: { ...data, industries: { deleteMany: {}, create: links } },
      });
    } else {
      const last = await prisma.service.aggregate({ _max: { displayOrder: true } });
      const created = await prisma.service.create({
        data: { ...data, displayOrder: (last._max.displayOrder ?? 0) + 1, industries: { create: links } },
      });
      savedId = created.id;
    }
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "This URL slug is already used by another service." } };
    }
    log.error("service_save_failed", describeError(err));
    return { ok: false, message: "The service could not be saved. Please try again." };
  }

  log.info("admin_service_saved", { adminId: admin.id, serviceId: savedId, status: data.status });
  revalidatePublicContent("services", "homepage");
  if (!id) redirect(`/admin/services/${savedId}?created=1`);
  return { ok: true, message: "Service saved." };
}

export async function deleteService(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.service.delete({ where: { id } });
  log.info("admin_service_deleted", { adminId: admin.id, serviceId: id });
  revalidatePublicContent("services", "homepage");
  redirect("/admin/services");
}

export async function setServiceStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  await prisma.service.update({ where: { id }, data: { status } });
  log.info("admin_service_status", { adminId: admin.id, serviceId: id, status });
  revalidatePublicContent("services", "homepage");
}

export async function toggleServiceFeatured(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const current = await prisma.service.findUnique({ where: { id }, select: { featured: true } });
  if (!current) return;
  await prisma.service.update({ where: { id }, data: { featured: !current.featured } });
  revalidatePublicContent("services", "homepage");
}

/** Swap a service with its neighbour, then rewrite display order as 1..n. */
export async function moveService(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const all = await prisma.service.findMany({ orderBy: [{ displayOrder: "asc" }, { title: "asc" }], select: { id: true } });
  const from = all.findIndex((s) => s.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= all.length) return;
  [all[from], all[to]] = [all[to]!, all[from]!];

  await prisma.$transaction(all.map((s, i) => prisma.service.update({ where: { id: s.id }, data: { displayOrder: i + 1 } })));
  revalidatePublicContent("services", "homepage");
}
