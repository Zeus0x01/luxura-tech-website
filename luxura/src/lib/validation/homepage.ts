import { z } from "zod";
import { hrefRef, imageRef, optionalText } from "./common";

export const homepageKeys = [
  "HERO",
  "ABOUT",
  "SERVICES",
  "HOW_WE_HELP",
  "INDUSTRIES",
  "WHY_LUXURA",
  "FINAL_CTA",
] as const;
export type HomepageKey = (typeof homepageKeys)[number];

export const homepageSectionSchema = z.object({
  key: z.enum(homepageKeys),
  enabled: z
    .union([z.literal("on"), z.literal("true"), z.literal("")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
  title: optionalText(190),
  subtitle: optionalText(1200),
  body: optionalText(6000),
  image: imageRef,
  primaryCtaLabel: optionalText(60),
  primaryCtaHref: hrefRef,
  secondaryCtaLabel: optionalText(60),
  secondaryCtaHref: hrefRef,
  itemTitle: z.array(z.string().trim().max(150)).default([]),
  itemBody: z.array(z.string().trim().max(1200)).default([]),
  featuredIds: z.array(z.string().min(1).max(191)).default([]),
});
