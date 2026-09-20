"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { idSchema, leadNotesSchema, leadStatusSchema } from "@/lib/validation/leads";
import type { FormState } from "@/lib/admin/form";
import { describeError, log } from "@/lib/logger";

export async function updateLeadStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const status = leadStatusSchema.parse(formData.get("status"));
  await prisma.lead.update({ where: { id }, data: { status } });
  log.info("admin_lead_status", { adminId: admin.id, leadId: id, status });
  revalidatePath("/admin", "layout");
}

export async function archiveLead(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.lead.update({ where: { id }, data: { status: "ARCHIVED" } });
  log.info("admin_lead_archived", { adminId: admin.id, leadId: id });
  revalidatePath("/admin", "layout");
}

export async function deleteLead(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.lead.delete({ where: { id } });
  log.info("admin_lead_deleted", { adminId: admin.id, leadId: id });
  redirect("/admin/leads");
}

export async function saveLeadNotes(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = leadNotesSchema.safeParse(formData.get("internalNotes") ?? "");
  if (!parsed.success) return { ok: false, errors: { internalNotes: parsed.error.issues[0]?.message ?? "Invalid notes." } };
  try {
    await prisma.lead.update({ where: { id }, data: { internalNotes: parsed.data || null } });
  } catch (err) {
    log.error("lead_notes_failed", describeError(err));
    return { ok: false, message: "Notes could not be saved." };
  }
  log.info("admin_lead_notes", { adminId: admin.id, leadId: id });
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true, message: "Notes saved." };
}
