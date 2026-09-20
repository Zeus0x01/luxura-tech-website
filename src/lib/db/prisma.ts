import "server-only";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * One PrismaClient per Node.js process, created lazily so that importing this
 * module never requires DATABASE_URL (for example while `next build` collects
 * page data). Prisma only ever runs on the server.
 *
 * Works with Neon PostgreSQL (pooled connection string recommended for Vercel).
 */
function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!globalForPrisma.__prisma) globalForPrisma.__prisma = createClient();
  return globalForPrisma.__prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
