"use client";

import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUNDLED_IMAGES } from "@/lib/images";
import { ICON_KEYS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/admin/form";

/**
 * Runs a Server Action from a normal onSubmit handler.
 *
 * Why not <form action={fn}>? React 19 resets uncontrolled fields after a form
 * action finishes, which would wipe what the admin typed whenever validation
 * fails. Submitting through onSubmit keeps every field as typed.
 */
export function useActionForm(action: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const [state, setState] = useState<FormState>(undefined);
  const [pending, startTransition] = useTransition();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await action(state, formData));
    });
  };
  return [state, onSubmit, pending] as const;
}

export function SubmitButton({
  children,
  pendingText = "Saving…",
  pending: pendingProp,
  ...props
}: ButtonProps & { pendingText?: string; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Loader2 className="animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (!state?.message) return null;
  const ok = state.ok;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={cn(
        "flex items-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-medium",
        ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
      )}
    >
      {ok ? <CheckCircle2 className="size-4 shrink-0" /> : <TriangleAlert className="size-4 shrink-0" />}
      {state.message}
    </p>
  );
}

export function Field({
  label,
  name,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function ImagePicker({ name, label = "Image", defaultValue, error }: { name: string; label?: string; defaultValue?: string | null; error?: string }) {
  const listId = `${name}-list`;
  return (
    <Field
      label={label}
      name={name}
      error={error}
      hint="Choose a bundled image or paste a path (/images/…) or a full https:// URL. Remote hosts must be listed in IMAGE_REMOTE_HOSTS to be optimized."
    >
      <Input id={name} name={name} list={listId} defaultValue={defaultValue ?? ""} placeholder="/images/highway.jpg" aria-invalid={!!error} />
      <datalist id={listId}>
        {BUNDLED_IMAGES.map((img) => (
          <option key={img.path} value={img.path}>
            {img.label}
          </option>
        ))}
      </datalist>
      {defaultValue && defaultValue.startsWith("/") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={defaultValue} alt="" className="mt-3 h-24 w-40 rounded-md border border-line object-cover" />
      )}
    </Field>
  );
}

export function IconSelect({ name, defaultValue, error }: { name: string; defaultValue?: string | null; error?: string }) {
  return (
    <Field label="Icon" name={name} error={error}>
      <Select id={name} name={name} defaultValue={defaultValue ?? ""}>
        <option value="">Default</option>
        {ICON_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function StatusSelect({ name = "status", defaultValue = "DRAFT" }: { name?: string; defaultValue?: string }) {
  return (
    <Field label="Status" name={name} hint="Only published items appear on the website.">
      <Select id={name} name={name} defaultValue={defaultValue}>
        <option value="DRAFT">Draft (hidden)</option>
        <option value="PUBLISHED">Published (visible)</option>
      </Select>
    </Field>
  );
}

export function CheckField({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-4 rounded border-line accent-navy-900" />
      <span>
        <span className="text-sm font-medium text-navy-900">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** Wraps a Server Action form with a browser confirmation prompt. */
export function ConfirmForm({
  action,
  message,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
