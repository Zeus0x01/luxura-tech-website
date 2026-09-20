import "server-only";

type Level = "info" | "warn" | "error";

const SENSITIVE = /pass(word)?|secret|token|api[-_]?key|authorization|cookie/i;

function safeValue(key: string, value: unknown): unknown {
  if (SENSITIVE.test(key)) return "[redacted]";
  if (value instanceof Error) return describeError(value);
  return value;
}

/**
 * Reduce an error to fields that are safe to log. Prisma error messages can
 * embed query arguments, so only the name, code and first line are kept.
 */
export function describeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    const code = (err as { code?: unknown }).code;
    return {
      name: err.name,
      ...(typeof code === "string" ? { code } : {}),
      message: err.message.split("\n")[0]?.slice(0, 300),
    };
  }
  return { message: "Unknown error" };
}

function emit(level: Level, event: string, data?: Record<string, unknown>) {
  const entry: Record<string, unknown> = { ts: new Date().toISOString(), level, event };
  if (data) {
    for (const [key, value] of Object.entries(data)) entry[key] = safeValue(key, value);
  }
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, data?: Record<string, unknown>) => emit("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => emit("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => emit("error", event, data),
};
