import "server-only";
import { Resend } from "resend";
import { getSiteUrl } from "@/lib/env";
import { describeError, log } from "@/lib/logger";

export type LeadForEmail = {
  id: string;
  fullName: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  serviceTitle: string | null;
  preferredContactMethod: string;
  message: string;
};

const METHOD_LABEL: Record<string, string> = { EMAIL: "Email", PHONE: "Phone", EITHER: "Either" };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Remove CR/LF so user input can never inject extra email headers. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function recipients(): string[] {
  return (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Send the "new lead" notification. NEVER throws: the lead is already saved in
 * the database, so an email problem must not turn into a lost or failed lead.
 * Returns true only when Resend accepted the message.
 */
export async function sendLeadNotification(lead: LeadForEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = recipients();

  if (!apiKey || to.length === 0) {
    log.warn("lead_email_skipped", { leadId: lead.id, reason: !apiKey ? "no_api_key" : "no_recipient" });
    return false;
  }

  const adminUrl = `${getSiteUrl()}/admin/leads/${lead.id}`;
  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Company", lead.company ?? "—"],
    ["Email", lead.email],
    ["Phone", lead.phone ?? "—"],
    ["Country", lead.country ?? "—"],
    ["Service of interest", lead.serviceTitle ?? "General enquiry"],
    ["Preferred contact", METHOD_LABEL[lead.preferredContactMethod] ?? lead.preferredContactMethod],
  ];

  const html = `<!doctype html><html><body style="margin:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#0a1b36">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#0a1b36;padding:20px 28px"><span style="color:#d4fb54;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:bold">New consultation request</span></td></tr>
<tr><td style="padding:28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 0;color:#55647d;width:150px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:22px 0 6px;color:#55647d;font-size:13px">Message</p>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;border-left:3px solid #d4fb54;padding-left:14px">${escapeHtml(lead.message)}</div>
<p style="margin:28px 0 0"><a href="${escapeHtml(adminUrl)}" style="background:#0a1b36;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:bold;display:inline-block">Open in dashboard</a></p>
</td></tr></table></td></tr></table></body></html>`;

  const text = [
    "New consultation request",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message,
    "",
    `Open in dashboard: ${adminUrl}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Website <onboarding@resend.dev>",
      to,
      replyTo: lead.email,
      subject: oneLine(`New consultation request — ${lead.fullName}${lead.company ? ` (${lead.company})` : ""}`).slice(0, 200),
      html,
      text,
    });

    if (error) {
      log.error("lead_email_failed", { leadId: lead.id, provider: "resend", code: error.name, message: error.message });
      return false;
    }
    return true;
  } catch (err) {
    log.error("lead_email_failed", { leadId: lead.id, provider: "resend", ...describeError(err) });
    return false;
  }
}
