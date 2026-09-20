import "server-only";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./config";
import { verifyAgainstDummy, verifyPassword } from "./password";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";
import { getClientIp, hashIdentifier } from "@/lib/security/hash";
import { rateLimit, resetRateLimit } from "@/lib/security/rate-limit";
import { describeError, log } from "@/lib/logger";

class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

const LOGIN_WINDOW_SECONDS = 15 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = getClientIp(request.headers);
        const ipKey = `login-ip:${hashIdentifier(ip)}`;
        const emailKey = `login-email:${hashIdentifier(email)}`;

        // Throttle by IP (spraying) and by account (targeted guessing).
        const [byIp, byEmail] = await Promise.all([
          rateLimit({ key: ipKey, limit: 20, windowSeconds: LOGIN_WINDOW_SECONDS }),
          rateLimit({ key: emailKey, limit: 6, windowSeconds: LOGIN_WINDOW_SECONDS }),
        ]);
        if (!byIp.allowed || !byEmail.allowed) {
          log.warn("admin_login_rate_limited", { emailHash: hashIdentifier(email) });
          throw new RateLimitedError();
        }

        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            await verifyAgainstDummy(password);
            log.warn("admin_login_failed", { reason: "unknown_user", emailHash: hashIdentifier(email) });
            return null;
          }

          const valid = await verifyPassword(password, user.passwordHash);
          if (!valid || !user.isActive) {
            log.warn("admin_login_failed", {
              reason: valid ? "inactive" : "bad_password",
              emailHash: hashIdentifier(email),
            });
            return null;
          }

          await resetRateLimit(emailKey);
          await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
          log.info("admin_login_success", { userId: user.id });

          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } catch (err) {
          log.error("admin_login_error", describeError(err));
          return null;
        }
      },
    }),
  ],
});
