import { z } from "zod";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "CLOSED", "ARCHIVED"] as const;
export const leadStatusSchema = z.enum(LEAD_STATUSES);
export const leadNotesSchema = z.string().trim().max(10000, "Keep notes under 10,000 characters.");
export const idSchema = z.string().min(1).max(191);

export const LEAD_STATUS_LABEL: Record<(typeof LEAD_STATUSES)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  QUALIFIED: "Qualified",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};
