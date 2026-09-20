import "server-only";
import type { z } from "zod";

export type FormState =
  | { ok?: boolean; message?: string; errors?: Record<string, string> }
  | undefined;

/** Turn FormData into a plain object; keys listed in `arrays` collect every value. */
export function formToObject(fd: FormData, arrays: string[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    if (key.startsWith("$ACTION")) continue; // Next.js internal fields
    out[key] = arrays.includes(key)
      ? fd.getAll(key).filter((v): v is string => typeof v === "string")
      : (() => {
          const v = fd.get(key);
          return typeof v === "string" ? v : "";
        })();
  }
  for (const key of arrays) out[key] ??= [];
  return out;
}

export function parseForm<S extends z.ZodType>(
  schema: S,
  fd: FormData,
  arrays: string[] = [],
): { ok: true; data: z.output<S> } | { ok: false; state: NonNullable<FormState> } {
  const result = schema.safeParse(formToObject(fd, arrays));
  if (result.success) return { ok: true, data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false, state: { ok: false, message: "Please fix the highlighted fields.", errors } };
}

/** Prisma unique-constraint violation (e.g. duplicate slug). */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}
