import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmForm } from "./form-kit";
import { PublishBadge } from "./ui";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  title: string;
  subtitle: string;
  status: "DRAFT" | "PUBLISHED";
  featured?: boolean;
};

type Actions = {
  setStatus: (fd: FormData) => Promise<void>;
  remove: (fd: FormData) => Promise<void>;
  toggleFeatured?: (fd: FormData) => Promise<void>;
  move?: (fd: FormData) => Promise<void>;
};

/** Responsive management list shared by services, industries and articles. */
export function ContentTable({ rows, basePath, publicPath, actions, noun }: { rows: Row[]; basePath: string; publicPath: string; actions: Actions; noun: string }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
      {rows.map((row, i) => (
        <li key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href={`${basePath}/${row.id}`} className="font-semibold text-navy-950 hover:text-brand">
                {row.title}
              </Link>
              <PublishBadge status={row.status} />
              {row.featured && <span className="text-xs font-semibold text-navy-600">★ Featured</span>}
            </div>
            <p className="mt-0.5 truncate text-sm text-muted">
              {row.status === "PUBLISHED" ? (
                <a href={`${publicPath}/${row.subtitle}`} target="_blank" rel="noopener" className="hover:underline">
                  {publicPath}/{row.subtitle}
                </a>
              ) : (
                `${publicPath}/${row.subtitle}`
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {actions.move && (
              <>
                <form action={actions.move}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="up" />
                  <Button type="submit" variant="ghost" size="icon" aria-label={`Move ${row.title} up`} disabled={i === 0}>
                    <ArrowUp />
                  </Button>
                </form>
                <form action={actions.move}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="down" />
                  <Button type="submit" variant="ghost" size="icon" aria-label={`Move ${row.title} down`} disabled={i === rows.length - 1}>
                    <ArrowDown />
                  </Button>
                </form>
              </>
            )}
            {actions.toggleFeatured && (
              <form action={actions.toggleFeatured}>
                <input type="hidden" name="id" value={row.id} />
                <Button type="submit" variant="ghost" size="icon" aria-label={row.featured ? "Remove from featured" : "Mark as featured"} title={row.featured ? "Remove from featured" : "Mark as featured"}>
                  <Star className={cn(row.featured && "fill-lime-400 text-navy-900")} />
                </Button>
              </form>
            )}
            <form action={actions.setStatus}>
              <input type="hidden" name="id" value={row.id} />
              <input type="hidden" name="status" value={row.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
              <Button type="submit" variant="outline" size="sm">
                {row.status === "PUBLISHED" ? <EyeOff /> : <Eye />}
                {row.status === "PUBLISHED" ? "Unpublish" : "Publish"}
              </Button>
            </form>
            <Button asChild variant="ghost" size="icon">
              <Link href={`${basePath}/${row.id}`} aria-label={`Edit ${row.title}`}>
                <Pencil />
              </Link>
            </Button>
            <ConfirmForm action={actions.remove} message={`Delete this ${noun}? This cannot be undone.`}>
              <input type="hidden" name="id" value={row.id} />
              <Button type="submit" variant="ghost" size="icon" aria-label={`Delete ${row.title}`} className="text-red-600 hover:bg-red-50">
                <Trash2 />
              </Button>
            </ConfirmForm>
          </div>
        </li>
      ))}
    </ul>
  );
}
