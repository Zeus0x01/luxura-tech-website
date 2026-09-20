"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { submitLead } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ServiceOption = { id: string; slug: string; title: string };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

export function ContactForm({ services }: { services: ServiceOption[] }) {
  const params = useSearchParams();
  const preselected = services.find((s) => s.slug === params.get("service"))?.id ?? "";
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef<number>(0);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      country: "",
      serviceId: preselected,
      preferredContactMethod: "EMAIL",
      message: "",
      website: "",
    },
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (preselected) setValue("serviceId", preselected);
  }, [preselected, setValue]);

  function onSubmit(values: ContactInput) {
    setFormError(null);
    startTransition(async () => {
      try {
        const result = await submitLead({ ...values, startedAt: startedAt.current });
        if (result.ok) {
          setDone(true);
          return;
        }
        setFormError(result.message);
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
          setError(field as keyof ContactInput, { message });
        }
      } catch {
        setFormError("We couldn't send your request. Please check your connection and try again.");
      }
    });
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-8 shadow-card sm:p-10">
        <CheckCircle2 className="size-10 text-emerald-600" />
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-950">Thank you — your request has been received.</h2>
        <p className="mt-3 leading-relaxed text-muted">
          A member of our team will review your message and get back to you using your preferred contact method.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name *</Label>
          <Input id="fullName" autoComplete="name" className="mt-1.5" aria-invalid={!!errors.fullName} aria-describedby="fullName-err" {...register("fullName")} />
          <FieldError id="fullName-err" message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" autoComplete="organization" className="mt-1.5" aria-invalid={!!errors.company} aria-describedby="company-err" {...register("company")} />
          <FieldError id="company-err" message={errors.company?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" autoComplete="email" inputMode="email" className="mt-1.5" aria-invalid={!!errors.email} aria-describedby="email-err" {...register("email")} />
          <FieldError id="email-err" message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" className="mt-1.5" aria-invalid={!!errors.phone} aria-describedby="phone-err" {...register("phone")} />
          <FieldError id="phone-err" message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" autoComplete="country-name" className="mt-1.5" aria-invalid={!!errors.country} aria-describedby="country-err" {...register("country")} />
          <FieldError id="country-err" message={errors.country?.message} />
        </div>
        <div>
          <Label htmlFor="serviceId">Service of interest</Label>
          <Select id="serviceId" className="mt-1.5" {...register("serviceId")}>
            <option value="">General enquiry</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-navy-900">Preferred contact method</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {(
            [
              ["EMAIL", "Email"],
              ["PHONE", "Phone"],
              ["EITHER", "Either"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="has-[:checked]:border-navy-900 has-[:checked]:bg-navy-900 has-[:checked]:text-white flex cursor-pointer items-center rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand">
              <input type="radio" value={value} className="sr-only" {...register("preferredContactMethod")} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Label htmlFor="message">How can we help? *</Label>
        <Textarea id="message" rows={6} className="mt-1.5" aria-invalid={!!errors.message} aria-describedby="message-err" {...register("message")} />
        <FieldError id="message-err" message={errors.message?.message} />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {formError && (
        <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          We use your details only to respond to your request. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-navy-900">
            Privacy Policy
          </a>
          .
        </p>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 className="animate-spin" />}
          {pending ? "Sending…" : "Send request"}
        </Button>
      </div>
    </form>
  );
}
