import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CmsImage } from "./cms-image";
import { getIcon } from "@/lib/icons";
import { cn, formatDate } from "@/lib/utils";
import type { ArticleListDTO, IndustryDTO, ServiceDTO } from "@/lib/data/types";

export function ServiceCard({ service, className }: { service: ServiceDTO; className?: string }) {
  const Icon = getIcon(service.icon);
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        {service.coverImage && (
          <CmsImage
            src={service.coverImage}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex size-11 items-center justify-center rounded-lg bg-lime-400 text-navy-950 shadow-md">
          <Icon className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-navy-950">{service.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 group-hover:text-brand">
          Learn more
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function IndustryTile({ industry, className, tall = false }: { industry: IndustryDTO; className?: string; tall?: boolean }) {
  const Icon = getIcon(industry.icon);
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className={cn(
        "on-dark group relative isolate flex overflow-hidden rounded-xl bg-navy-900 text-white shadow-card",
        tall ? "min-h-[300px]" : "min-h-[240px]",
        className,
      )}
    >
      {industry.image && (
        <CmsImage
          src={industry.image}
          alt=""
          fill
          sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw"
          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/10 transition-opacity" />
      <div className="flex w-full flex-col justify-end p-6">
        <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-white/10 text-lime-400 backdrop-blur-sm">
          <Icon className="size-5" />
        </span>
        <h3 className="font-display text-xl font-semibold leading-snug">{industry.name}</h3>
        <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/70">{industry.description}</p>
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-lime-400 transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}

export function ArticleCard({ article }: { article: ArticleListDTO }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
        {article.featuredImage && (
          <CmsImage
            src={article.featuredImage}
            alt=""
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-600">
          {article.category?.name ? `${article.category.name} · ` : ""}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950 group-hover:text-brand">{article.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted">{article.excerpt}</p>
      </div>
    </Link>
  );
}
