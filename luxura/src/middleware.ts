import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

// First-line gate for /admin/*. The real authorization check happens again
// server-side in requireAdmin() for every page and Server Action.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
