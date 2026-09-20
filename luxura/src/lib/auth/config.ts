import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration (no database, no Node-only modules).
 * Used by middleware; the full configuration in ./index.ts adds the
 * Credentials provider.
 *
 * Middleware is only a first gate. Every admin page and every admin Server
 * Action re-checks the session and the database user via requireAdmin().
 */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (!path.startsWith("/admin")) return true;

      const loggedIn = Boolean(auth?.user);
      if (path === "/admin/login") {
        return loggedIn ? Response.redirect(new URL("/admin", nextUrl)) : true;
      }
      return loggedIn; // false → redirected to /admin/login
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
