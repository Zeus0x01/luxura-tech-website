import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const csvHosts = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

const authHost = (() => {
  try {
    return process.env.AUTH_URL ? new URL(process.env.AUTH_URL).host : null;
  } catch {
    return null;
  }
})();

const allowedOrigins = [...(authHost ? [authHost] : []), ...csvHosts(process.env.ALLOWED_ORIGINS)];

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["bcryptjs", "pg", "@prisma/adapter-pg"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: csvHosts(process.env.IMAGE_REMOTE_HOSTS).map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  experimental: {
    serverActions: {
      allowedOrigins: allowedOrigins.length ? allowedOrigins : undefined,
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
