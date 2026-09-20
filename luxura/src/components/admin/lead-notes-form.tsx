"use client";

import { saveLeadNotes } from "@/actions/leads";
import { Textarea } from "@/components/ui/input";
import { FormStatus, SubmitButton, useActionForm } from "./form-kit";

export function LeadNotesForm({ id, notes }: { id: string; notes: string }) {
  const [state, onSubmit, pending] = useActionForm(saveLeadNotes.bind(null, id));
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="internalNotes" className="sr-only">
        Internal notes
      </label>
      <Textarea id="internalNotes" name="internalNotes" rows={7} defaultValue={notes} placeholder="Private notes about this lead. Never shown publicly." maxLength={10000} />
      {state?.errors?.internalNotes && <p className="text-sm text-red-600">{state.errors.internalNotes}</p>}
      <FormStatus state={state} />
      <SubmitButton pending={pending} variant="dark" size="sm">
        Save notes
      </SubmitButton>
    </form>
  );
}
