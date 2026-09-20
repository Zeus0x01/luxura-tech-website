type LogLevel = "debug" | "info" | "warn" | "error";

function redact(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.includes("postgresql://") || value.includes("mysql://")) return "[REDACTED_DB_URL]";
    if (value.length > 20 && /^[A-Za-z0-9+/=_-]{20,}$/.test(value)) return "[REDACTED]";
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (/password|secret|token|key|authorization/i.test(k)) out[k] = "[REDACTED]";
      else out[k] = redact(v);
    }
    return out;
  }
  return value;
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const entry = {
    level,
    message,
    ts: new Date().toISOString(),
    ...(meta !== undefined ? { meta: redact(meta) } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
