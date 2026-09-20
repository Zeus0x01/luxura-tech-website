"use server";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { settingsSchema } from "@/lib/validation/settings";
import { parseForm, type FormState } from "@/lib/admin/form";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { describeError, log } from "@/lib/logger";

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseForm(settingsSchema, formData);
  if (!parsed.ok) return parsed.state;
  try {
    await prisma.siteSetting.upsert({
      where: { id: "default" },
      create: { id: "default", ...parsed.data },
      update: parsed.data,
    });
  } catch (err) {
    log.error("settings_save_failed", describeError(err));
    return { ok: false, message: "Settings could not be saved. Please try again." };
  }
  log.info("admin_settings_saved", { adminId: admin.id });
  revalidatePublicContent();
  return { ok: true, message: "Settings saved." };
}
