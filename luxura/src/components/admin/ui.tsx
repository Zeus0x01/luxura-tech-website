import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABEL } from "@/lib/validation/leads";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-8", className)}>{children}</div>;
}

const LEAD_TONE = {
  NEW: "lime",
  CONTACTED: "blue",
  IN_PROGRESS: "amber",
  QUALIFIED: "green",
  CLOSED: "neutral",
  ARCHIVED: "neutral",
} as const;

export function LeadStatusBadge({ status }: { status: keyof typeof LEAD_TONE }) {
  return <Badge tone={LEAD_TONE[status]}>{LEAD_STATUS_LABEL[status]}</Badge>;
}

export function PublishBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return <Badge tone={status === "PUBLISHED" ? "green" : "amber"}>{status === "PUBLISHED" ? "Published" : "Draft"}</Badge>;
}

export function EmptyState({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-900/20 bg-white p-10 text-center">
      <p className="font-medium text-navy-900">{title}</p>
      {action && (
        <Link href={action.href} className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
