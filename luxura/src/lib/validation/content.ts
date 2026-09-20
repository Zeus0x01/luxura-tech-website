import { z } from "zod";
import {
  checkbox,
  contentStatus,
  imageRef,
  optionalText,
  seoDescription,
  seoTitle,
  slugSchema,
} from "./common";
import { ICON_KEYS } from "@/lib/icons";

const iconKey = z
  .string()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || (ICON_KEYS as readonly string[]).includes(v), "Choose an icon from the list.");

const capabilities = z
  .string()
  .max(4000)
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  )
  .refine((lines) => lines.length <= 30, "Use at most 30 capabilities.")
  .refine((lines) => lines.every((l) => l.length <= 120), "Keep each capability under 120 characters.")
  .transform((lines) => lines.join("\n"));

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Enter a title.").max(120),
  slug: slugSchema,
  shortDescription: z.string().trim().min(10, "Write at least a short sentence.").max(500),
  description: z.string().trim().min(20, "Add a fuller description.").max(10000),
  capabilities,
  businessValue: optionalText(2000),
  icon: iconKey,
  coverImage: imageRef,
  status: contentStatus,
  featured: checkbox,
  seoTitle,
  seoDescription,
  industryIds: z.array(z.string().min(1).max(191)).default([]),
});

export const industrySchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(120),
  slug: slugSchema,
  description: z.string().trim().min(10, "Write at least a short sentence.").max(4000),
  image: imageRef,
  icon: iconKey,
  status: contentStatus,
  featured: checkbox,
  seoTitle,
  seoDescription,
});

export const articleSchema = z.object({
  title: z.string().trim().min(3, "Enter a title.").max(190),
  slug: slugSchema,
  excerpt: z.string().trim().min(10, "Write a short summary.").max(600),
  content: z.string().trim().min(20, "Add the article body.").max(200000),
  featuredImage: imageRef,
  author: z.string().trim().min(2, "Enter an author.").max(120),
  categoryId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  status: contentStatus,
  publishedAt: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use the date picker (YYYY-MM-DD).")
    .transform((v) => (v ? new Date(`${v}T12:00:00.000Z`) : null)),
  seoTitle,
  seoDescription,
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(80),
});
