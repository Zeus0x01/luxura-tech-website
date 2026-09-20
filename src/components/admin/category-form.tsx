"use client";

import { useEffect, useRef } from "react";
import { createCategory } from "@/actions/articles";
import { Input } from "@/components/ui/input";
import { FormStatus, SubmitButton, useActionForm } from "./form-kit";

export function CategoryForm() {
  const [state, onSubmit, pending] = useActionForm(createCategory);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input name="name" aria-label="New category name" placeholder="New category" maxLength={80} required />
        <SubmitButton pending={pending} variant="dark" pendingText="Adding…">
          Add
        </SubmitButton>
      </div>
      {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name}</p>}
      <FormStatus state={state} />
    </form>
  );
}
