/** Canonical public URL of the site (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${p === "/" ? "" : p}` || getSiteUrl();
}
