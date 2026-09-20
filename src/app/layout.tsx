import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSiteUrl } from "@/lib/env";
import { getSiteSettings } from "@/lib/data/public";
import { DEFAULT_SETTINGS } from "@/lib/data/defaults";
import { cn } from "@/lib/utils";

const sora = localFont({
  src: "../fonts/sora-latin-wght-normal.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});
const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a1b36",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  // Never let a database hiccup break every page's metadata.
  const settings = await getSiteSettings().catch(() => DEFAULT_SETTINGS);
  const title = settings.defaultSeoTitle || settings.companyName;
  const description = settings.defaultSeoDescription || DEFAULT_SETTINGS.defaultSeoDescription!;
  const ogImage = settings.defaultOgImage || "/og-default.jpg";

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: title, template: `%s | ${settings.companyName}` },
    description,
    applicationName: settings.companyName,
    openGraph: {
      type: "website",
      siteName: settings.companyName,
      title,
      description,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.companyName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(sora.variable, inter.variable)}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
