import "server-only";
import { createHash } from "node:crypto";

/** Hash an identifier (IP, email) so raw values never sit in the rate-limit table or logs. */
export function hashIdentifier(value: string): string {
  const pepper = process.env.AUTH_SECRET ?? "luxura";
  return createHash("sha256").update(`${pepper}:${value.toLowerCase()}`).digest("hex").slice(0, 32);
}

export function getClientIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return "unknown";
}
