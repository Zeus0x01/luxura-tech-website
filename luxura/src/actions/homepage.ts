"use server";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { homepageSectionSchema } from "@/lib/validation/homepage";
import { parseForm, type FormState } from "@/lib/admin/form";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { describeError, log } from "@/lib/logger";

const ITEM_SECTIONS = new Set(["HOW_WE_HELP", "WHY_LUXURA"]);

/** Save one homepage section (each section card on /admin/homepage has its own form). */
export async function saveHomepageSection(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseForm(homepageSectionSchema, formData, ["itemTitle", "itemBody", "featuredIds"]);
  if (!parsed.ok) return parsed.state;
  const { key, itemTitle, itemBody, featuredIds, ...fields } = parsed.data;

  if (!fields.title) return { ok: false, message: "Please fix the highlighted fields.", errors: { title: "A heading is required." } };

  // Rows are aligned by position. Blank rows are dropped.
  const items = itemTitle
    .map((title: string, i: number) => ({ title, body: itemBody[i] ?? "" }))
    .filter((it: { title: string; body: string }) => it.title && it.body);

  try {
    await prisma.$transaction(async (tx) => {
      const section = await tx.homepageSection.upsert({
        where: { key },
        create: { key, ...fields },
        update: fields,
      });

      if (ITEM_SECTIONS.has(key)) {
        await tx.homepageSectionItem.deleteMany({ where: { sectionId: section.id } });
        if (items.length) {
          await tx.homepageSectionItem.createMany({
            data: items.map((it: { title: string; body: string }, i: number) => ({ sectionId: section.id, title: it.title, body: it.body, displayOrder: i + 1 })),
          });
        }
      }

      if (key === "SERVICES") {
        await tx.service.updateMany({ data: { featured: false } });
        if (featuredIds.length) await tx.service.updateMany({ where: { id: { in: featuredIds } }, data: { featured: true } });
      }
      if (key === "INDUSTRIES") {
        await tx.industry.updateMany({ data: { featured: false } });
        if (featuredIds.length) await tx.industry.updateMany({ where: { id: { in: featuredIds } }, data: { featured: true } });
      }
    });
  } catch (err) {
    log.error("homepage_save_failed", { key, ...describeError(err) });
    return { ok: false, message: "This section could not be saved. Please try again." };
  }

  log.info("admin_homepage_saved", { adminId: admin.id, key });
  revalidatePublicContent();
  return { ok: true, message: "Saved. The change is live." };
}
