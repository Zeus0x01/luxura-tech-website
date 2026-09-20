"use client";

import { updateLeadStatus } from "@/actions/leads";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/validation/leads";
import { Select } from "@/components/ui/input";

/** Changes a lead's status as soon as a new value is picked. */
export function LeadStatusSelect({ id, status, compact = false }: { id: string; status: string; compact?: boolean }) {
  return (
    <form action={updateLeadStatus}>
      <input type="hidden" name="id" value={id} />
      <Select
        name="status"
        defaultValue={status}
        aria-label="Lead status"
        className={compact ? "h-9 w-36 text-sm" : "w-full sm:w-56"}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {LEAD_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
    </form>
  );
}
