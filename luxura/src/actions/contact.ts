"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { contactSchema } from "@/lib/validation/contact";
import { getClientIp, hashIdentifier } from "@/lib/security/hash";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendLeadNotification } from "@/lib/email/notify";
import { describeError, log } from "@/lib/logger";

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR = "Something went wrong while sending your request. Please try again, or email us directly.";

/**
 * Contact form submission.
 *   1. Validate (server-side, again — never trust the browser)
 *   2. Anti-spam: honeypot, minimum fill time, per-visitor and global rate limits
 *   3. Save the lead in MySQL  ← the database is the source of truth
 *   4. Try to send the Resend notification; a failure is logged and never
 *      affects the visitor or the saved lead.
 */
export async function submitLead(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // Bots fill the hidden field or submit instantly. Pretend success, store nothing.
  const tooFast = typeof data.startedAt === "number" && Date.now() - data.startedAt < 2500;
  if (data.website || tooFast) {
    log.warn("lead_spam_blocked", { reason: data.website ? "honeypot" : "too_fast" });
    return { ok: true };
  }

  const ipHash = hashIdentifier(getClientIp(await headers()));
  const [perVisitor, overall] = await Promise.all([
    rateLimit({ key: `contact-ip:${ipHash}`, limit: 5, windowSeconds: 60 * 60 }),
    rateLimit({ key: "contact-global", limit: 60, windowSeconds: 60 * 60 }),
  ]);
  if (!perVisitor.allowed || !overall.allowed) {
    log.warn("lead_rate_limited", { scope: perVisitor.allowed ? "global" : "visitor" });
    return {
      ok: false,
      message: "We've received several requests from you recently. Please try again a little later.",
    };
  }

  let lead;
  try {
    let serviceId: string | null = null;
    let serviceTitle: string | null = null;
    if (data.serviceId) {
      const service = await prisma.service.findFirst({
        where: { id: data.serviceId, status: "PUBLISHED" },
        select: { id: true, title: true },
      });
      if (service) {
        serviceId = service.id;
        serviceTitle = service.title;
      }
    }

    lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        country: data.country || null,
        serviceId,
        preferredContactMethod: data.preferredContactMethod,
        message: data.message,
        status: "NEW",
      },
    });

    // Best effort. The result only decides whether the dashboard shows a warning.
    const sent = await sendLeadNotification({
      id: lead.id,
      fullName: lead.fullName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      serviceTitle,
      preferredContactMethod: lead.preferredContactMethod,
      message: lead.message,
    });
    if (sent) {
      await prisma.lead
        .update({ where: { id: lead.id }, data: { notifiedAt: new Date() } })
        .catch((err) => log.error("lead_notified_flag_failed", { leadId: lead!.id, ...describeError(err) }));
    }

    return { ok: true };
  } catch (err) {
    log.error("lead_create_failed", describeError(err));
    return { ok: false, message: GENERIC_ERROR };
  }
}
