import Link from "next/link";
import { Inbox, Layers, FileText, Sparkles, TriangleAlert, Clock } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, LeadStatusBadge, PageHeader } from "@/components/admin/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [total, fresh, inProgress, services, articles, notNotified, recent] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "IN_PROGRESS" } }),
    prisma.service.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count({ where: { notifiedAt: null, status: { not: "ARCHIVED" } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, fullName: true, company: true, status: true, createdAt: true, service: { select: { title: true } } },
    }),
  ]);

  const stats = [
    { label: "Total leads", value: total, icon: Inbox, href: "/admin/leads?status=ALL" },
    { label: "New leads", value: fresh, icon: Sparkles, href: "/admin/leads?status=NEW", highlight: fresh > 0 },
    { label: "In progress", value: inProgress, icon: Clock, href: "/admin/leads?status=IN_PROGRESS" },
    { label: "Published services", value: services, icon: Layers, href: "/admin/services" },
    { label: "Published articles", value: articles, icon: FileText, href: "/admin/articles" },
  ];

  return (
    <AdminContainer>
      <PageHeader title="Dashboard" description="An overview of contact requests and published content." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, href, highlight }) => (
          <Link key={label} href={href} className="group">
            <Card className={`h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift ${highlight ? "ring-2 ring-lime-400" : ""}`}>
              <Icon className="size-5 text-navy-600" />
              <p className="mt-4 font-display text-3xl font-semibold text-navy-950">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {notNotified > 0 && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>{notNotified}</strong> {notNotified === 1 ? "lead was" : "leads were"} saved without an email notification going out. They are safe in the
            database. Check your Resend settings (API key, verified sender) if this is unexpected.
          </p>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent contact requests</CardTitle>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </CardHeader>
        {recent.length === 0 ? (
          <CardContent>
            <p className="py-6 text-center text-sm text-muted">No contact requests yet. They will appear here as soon as someone uses the contact form.</p>
          </CardContent>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-paper sm:flex-row sm:items-center sm:gap-4 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy-950">{l.fullName}</p>
                    <p className="truncate text-sm text-muted">
                      {[l.company, l.service?.title ?? "General enquiry"].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <LeadStatusBadge status={l.status} />
                  <p className="text-xs text-muted sm:w-44 sm:text-right">{formatDateTime(l.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminContainer>
  );
}
