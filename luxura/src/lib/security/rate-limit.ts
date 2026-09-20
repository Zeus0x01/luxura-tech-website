import "server-only";
import { prisma } from "@/lib/db/prisma";
import { describeError, log } from "@/lib/logger";

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Fixed-window rate limiter backed by the database, so it works on any Node.js
 * host without Redis. `key` must already be a hashed identifier.
 *
 * Fails open: if the database is unreachable we would rather accept a request
 * (the lead save will fail loudly anyway) than lock everyone out.
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = opts;
  const now = new Date();
  const windowMs = windowSeconds * 1000;

  try {
    const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });

    if (!bucket || now.getTime() - bucket.windowStart.getTime() >= windowMs) {
      await prisma.rateLimitBucket.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      void cleanup(now);
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (bucket.count >= limit) {
      const retryAfterSeconds = Math.ceil((bucket.windowStart.getTime() + windowMs - now.getTime()) / 1000);
      return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
    }

    await prisma.rateLimitBucket.update({ where: { key }, data: { count: { increment: 1 } } });
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    log.error("rate_limit_failed", describeError(err));
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** Reset a bucket, e.g. after a successful login. */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimitBucket.deleteMany({ where: { key } });
  } catch (err) {
    log.error("rate_limit_reset_failed", describeError(err));
  }
}

/** Occasionally drop expired buckets so the table stays tiny. */
async function cleanup(now: Date) {
  if (Math.random() > 0.02) return;
  try {
    await prisma.rateLimitBucket.deleteMany({
      where: { windowStart: { lt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) } },
    });
  } catch {
    /* best effort */
  }
}
