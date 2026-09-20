import Link from "next/link";
import { Archive, ArrowDown, ArrowUp, Eye, Search, Trash2 } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AdminContainer, EmptyState, LeadStatusBadge, PageHeader } from "@/components/admin/ui";
import { ConfirmForm } from "@/components/admin/form-kit";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { archiveLead, deleteLead } from "@/actions/leads";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/validation/leads";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Leads" };

const PAGE_SIZE = 15;
const SORTS = { createdAt: "createdAt", fullName: "fullName", company: "company", status: "status" } as const;
type SortKey = keyof typeof SORTS;

type SP = { q?: string; status?: string; sort?: string; dir?: string; page?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const statusParam = sp.status ?? "ACTIVE";
  const sort: SortKey = sp.sort && sp.sort in SORTS ? (sp.sort as SortKey) : "createdAt";
  const dir: "asc" | "desc" = sp.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.LeadWhereInput = {
    ...(statusParam === "ALL"
      ? {}
      : statusParam === "ACTIVE"
        ? { status: { not: "ARCHIVED" } }
        : (LEAD_STATUSES as readonly string[]).includes(statusParam)
          ? { status: statusParam as (typeof LEAD_STATUSES)[number] }
          : { status: { not: "ARCHIVED" } }),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q } },
            { company: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { [SORTS[sort]]: dir },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        company: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        service: { select: { title: true } },
      },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (over: Partial<SP>) => {
    const p = new URLSearchParams();
    const merged = { q, status: statusParam, sort, dir, page: String(page), ...over };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && v === "1")) p.set(k, String(v));
    return `/admin/leads?${p.toString()}`;
  };
  const sortLink = (key: SortKey) => qs({ sort: key, dir: sort === key && dir === "asc" ? "desc" : "asc", page: "1" });
  const SortHead = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <Link href={sortLink(k)} className="inline-flex items-center gap-1 hover:text-navy-950">
      {children}
      {sort === k && (dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
    </Link>
  );

  return (
    <AdminContainer>
      <PageHeader title="Leads" description="Contact requests submitted through the website." />

      <form method="get" className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-600" />
          <Input name="q" defaultValue={q} placeholder="Search name, company, email or phone" className="pl-10" aria-label="Search leads" />
        </div>
        <Select name="status" defaultValue={statusParam} aria-label="Filter by status" className="sm:w-48">
          <option value="ACTIVE">Active (not archived)</option>
          <option value="ALL">All</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />
        <Button type="submit" variant="dark">
          Apply
        </Button>
      </form>

      {leads.length === 0 ? (
        <EmptyState title={q || statusParam !== "ACTIVE" ? "No leads match your filters." : "No contact requests yet."} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-white shadow-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs font-semibold uppercase tracking-wider text-navy-600">
                <tr>
                  <th className="px-4 py-3"><SortHead k="fullName">Name</SortHead></th>
                  <th className="px-4 py-3"><SortHead k="company">Company</SortHead></th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3"><SortHead k="status">Status</SortHead></th>
                  <th className="px-4 py-3"><SortHead k="createdAt">Date</SortHead></th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => (
                  <tr key={l.id} className="align-middle hover:bg-paper/60">
                    <td className="px-4 py-3 font-semibold text-navy-950">
                      <Link href={`/admin/leads/${l.id}`} className="hover:text-brand">{l.fullName}</Link>
                    </td>
                    <td className="px-4 py-3">{l.company ?? "—"}</td>
                    <td className="max-w-[14rem] truncate px-4 py-3">{l.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{l.phone ?? "—"}</td>
                    <td className="px-4 py-3">{l.service?.title ?? "General"}</td>
                    <td className="px-4 py-3"><LeadStatusSelect id={l.id} status={l.status} compact /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon"><Link href={`/admin/leads/${l.id}`} aria-label={`View ${l.fullName}`}><Eye /></Link></Button>
                        {l.status !== "ARCHIVED" && (
                          <form action={archiveLead}>
                            <input type="hidden" name="id" value={l.id} />
                            <Button type="submit" variant="ghost" size="icon" aria-label={`Archive ${l.fullName}`}><Archive /></Button>
                          </form>
                        )}
                        <ConfirmForm action={deleteLead} message="Delete this lead permanently?">
                          <input type="hidden" name="id" value={l.id} />
                          <Button type="submit" variant="ghost" size="icon" aria-label={`Delete ${l.fullName}`} className="text-red-600 hover:bg-red-50"><Trash2 /></Button>
                        </ConfirmForm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {leads.map((l) => (
              <li key={l.id} className="rounded-xl border border-line bg-white p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy-950">{l.fullName}</Link>
                  <LeadStatusBadge status={l.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{[l.company, l.service?.title ?? "General enquiry"].filter(Boolean).join(" · ")}</p>
                <p className="mt-2 break-all text-sm">{l.email}</p>
                {l.phone && <p className="text-sm">{l.phone}</p>}
                <p className="mt-2 text-xs text-muted">{formatDate(l.createdAt)}</p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="dark"><Link href={`/admin/leads/${l.id}`}>Open</Link></Button>
                  {l.status !== "ARCHIVED" && (
                    <form action={archiveLead}>
                      <input type="hidden" name="id" value={l.id} />
                      <Button type="submit" size="sm" variant="outline">Archive</Button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <p className="text-muted">
            Page {page} of {pages} · {total} leads
          </p>
          <div className="flex gap-2">
            {page > 1 && <Button asChild variant="outline" size="sm"><Link href={qs({ page: String(page - 1) })}>Previous</Link></Button>}
            {page < pages && <Button asChild variant="outline" size="sm"><Link href={qs({ page: String(page + 1) })}>Next</Link></Button>}
          </div>
        </nav>
      )}
    </AdminContainer>
  );
}
