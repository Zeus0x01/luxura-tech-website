import { z } from "zod";
import { imageRef, optionalText } from "./common";

const https = z
  .string()
  .trim()
  .max(500)
  .optional()
  .refine((v) => !v || /^https:\/\/[^\s]+$/.test(v), "Use a full https:// URL.")
  .transform((v) => (v ? v : null));

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2, "Enter the company name.").max(190),
  companyEmail: z
    .string()
    .trim()
    .max(190)
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email address.")
    .transform((v) => (v ? v : null)),
  phone: optionalText(60),
  address: optionalText(500),
  logoUrl: imageRef,
  faviconUrl: imageRef,
  defaultOgImage: imageRef,
  linkedinUrl: https,
  xUrl: https,
  facebookUrl: https,
  instagramUrl: https,
  youtubeUrl: https,
  footerText: optionalText(500),
  defaultSeoTitle: optionalText(190),
  defaultSeoDescription: optionalText(320),
});
