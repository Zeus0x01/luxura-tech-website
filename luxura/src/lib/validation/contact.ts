import { z } from "zod";

// Shared by the browser (React Hook Form) and the Server Action, so the rules
// are identical on both sides. The server always re-validates.

export const CONTACT_METHODS = ["EMAIL", "PHONE", "EITHER"] as const;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "That name is too long."),
  company: z.string().trim().max(160, "That is too long.").optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(190),
  phone: z
    .string()
    .trim()
    .max(30, "That phone number is too long.")
    .regex(/^[+()\d\s.\-x]*$/i, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
  country: z.string().trim().max(100, "That is too long.").optional().or(z.literal("")),
  serviceId: z.string().trim().max(191).optional().or(z.literal("")),
  preferredContactMethod: z.enum(CONTACT_METHODS),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(5000, "Please keep your message under 5,000 characters."),
  // Anti-spam: real visitors never fill the hidden field and take a moment to type.
  website: z.string().max(500).optional(),
  startedAt: z.number().int().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
