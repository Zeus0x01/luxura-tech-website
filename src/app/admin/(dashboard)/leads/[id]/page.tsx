import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, LeadStatusBadge, PageHeader } from "@/components/admin/ui";
import { ConfirmForm } from "@/components/admin/form-kit";
import { LeadNotesForm } from "@/components/admin/lead-notes-form";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { archiveLead, deleteLead } from "@/actions/leads";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Lead" };

const METHOD = { EMAIL: "Email", PHONE: "Phone", EITHER: "Either" } as const;

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { service: { select: { title: true } } } });
  if (!lead) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Name", lead.fullName],
    ["Company", lead.company ?? "—"],
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="text-brand hover:underline">{lead.email}</a>],
    ["Phone", lead.phone ? <a key="p" href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="text-brand hover:underline">{lead.phone}</a> : "—"],
    ["Country", lead.country ?? "—"],
    ["Service of interest", lead.service?.title ?? "General enquiry"],
    ["Preferred contact", METHOD[lead.preferredContactMethod]],
    ["Submitted", formatDateTime(lead.createdAt)],
    ["Email notification", lead.notifiedAt ? `Sent ${formatDateTime(lead.notifiedAt)}` : "Not sent"],
  ];

  return (
    <AdminContainer>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-950">
        <ArrowLeft className="size-4" /> All leads
      </Link>
      <PageHeader
        title={lead.fullName}
        description={lead.company ?? undefined}
        actions={
          <>
            <Button asChild size="sm" variant="outline"><a href={`mailto:${lead.email}`}><Mail /> Email</a></Button>
            {lead.phone && <Button asChild size="sm" variant="outline"><a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}><Phone /> Call</a></Button>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Contact information</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-navy-600">{k}</dt>
                    <dd className="mt-1 break-words text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Message</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap break-words leading-relaxed">{lead.message}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between"><CardTitle>Status</CardTitle><LeadStatusBadge status={lead.status} /></CardHeader>
            <CardContent className="space-y-4">
              <LeadStatusSelect id={lead.id} status={lead.status} />
              <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                {lead.status !== "ARCHIVED" && (
                  <form action={archiveLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <Button type="submit" size="sm" variant="outline"><Archive /> Archive</Button>
                  </form>
                )}
                <ConfirmForm action={deleteLead} message="Delete this lead permanently? This cannot be undone.">
                  <input type="hidden" name="id" value={lead.id} />
                  <Button type="submit" size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50"><Trash2 /> Delete</Button>
                </ConfirmForm>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Internal notes</CardTitle></CardHeader>
            <CardContent>
              <LeadNotesForm id={lead.id} notes={lead.internalNotes ?? ""} />
              <p className="mt-3 text-xs text-muted">Private. Never shown on the website.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminContainer>
  );
}
