import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(100, "Keep the URL slug under 100 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only.");

/** Trimmed optional text: empty string becomes null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : null));

/**
 * Image reference: a site-relative path (/images/x.jpg) or an https URL.
 * Anything else (javascript:, data:, protocol-relative //host) is rejected.
 */
export const imageRef = z
  .string()
  .trim()
  .max(500, "Keep this under 500 characters.")
  .optional()
  .refine(
    (v) => !v || (/^\/(?!\/)[A-Za-z0-9._~\-\/%]+$/.test(v) && !v.includes("..")) || /^https:\/\/[^\s]+$/.test(v),
    "Use a path that starts with / or a full https:// URL.",
  )
  .transform((v) => (v ? v : null));

/** Link target for buttons: internal path, https URL, mailto:, tel: or #anchor. */
export const hrefRef = z
  .string()
  .trim()
  .max(190, "Keep this under 190 characters.")
  .optional()
  .refine(
    (v) => !v || /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+|tel:[+0-9()\-\s.]+|#[\w-]+)$/.test(v),
    "Use an internal path (/contact), an https:// URL, mailto:, tel: or #anchor.",
  )
  .transform((v) => (v ? v : null));

export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("false"), z.literal(""), z.boolean()])
  .optional()
  .transform((v) => v === "on" || v === "true" || v === true);

export const contentStatus = z.enum(["DRAFT", "PUBLISHED"]);

export const seoTitle = optionalText(190);
export const seoDescription = optionalText(320);
