"use client";

import Link from "next/link";
import { saveService } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { CheckField, Field, FormStatus, IconSelect, ImagePicker, StatusSelect, SubmitButton, useActionForm } from "./form-kit";

type Props = {
  service?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    capabilities: string;
    businessValue: string | null;
    icon: string | null;
    coverImage: string | null;
    status: "DRAFT" | "PUBLISHED";
    featured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    industryIds: string[];
  };
  industries: { id: string; name: string }[];
};

export function ServiceForm({ service, industries }: Props) {
  const [state, onSubmit, pending] = useActionForm(saveService.bind(null, service?.id ?? null));
  const e = state?.errors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormStatus state={state} />
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" name="title" error={e.title}>
            <Input id="title" name="title" defaultValue={service?.title} required maxLength={120} aria-invalid={!!e.title} />
          </Field>
          <Field label="URL slug" name="slug" error={e.slug} hint="Appears in the address: /services/your-slug">
            <Input id="slug" name="slug" defaultValue={service?.slug} required maxLength={100} aria-invalid={!!e.slug} />
          </Field>
          <Field label="Short description" name="shortDescription" error={e.shortDescription} className="sm:col-span-2" hint="Shown on cards and under the page heading.">
            <Textarea id="shortDescription" name="shortDescription" rows={2} defaultValue={service?.shortDescription} required maxLength={500} aria-invalid={!!e.shortDescription} />
          </Field>
          <Field label="Description" name="description" error={e.description} className="sm:col-span-2" hint="Separate paragraphs with a blank line.">
            <Textarea id="description" name="description" rows={8} defaultValue={service?.description} required aria-invalid={!!e.description} />
          </Field>
          <Field label="Capabilities" name="capabilities" error={e.capabilities} className="sm:col-span-2" hint="One capability per line.">
            <Textarea id="capabilities" name="capabilities" rows={7} defaultValue={service?.capabilities} aria-invalid={!!e.capabilities} />
          </Field>
          <Field label="Business value" name="businessValue" error={e.businessValue} className="sm:col-span-2" hint="Optional. Shown in its own section on the service page.">
            <Textarea id="businessValue" name="businessValue" rows={4} defaultValue={service?.businessValue ?? ""} aria-invalid={!!e.businessValue} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance & visibility</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <ImagePicker name="coverImage" label="Cover image" defaultValue={service?.coverImage} error={e.coverImage} />
          <div className="space-y-5">
            <IconSelect name="icon" defaultValue={service?.icon} error={e.icon} />
            <StatusSelect defaultValue={service?.status ?? "DRAFT"} />
            <CheckField name="featured" label="Featured on the homepage" defaultChecked={service?.featured} />
          </div>
        </CardContent>
      </Card>

      {industries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related industries</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {industries.map((i) => (
              <label key={i.id} className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input type="checkbox" name="industryIds" value={i.id} defaultChecked={service?.industryIds.includes(i.id)} className="size-4 accent-navy-900" />
                {i.name}
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search engine listing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field label="SEO title" name="seoTitle" error={e.seoTitle} hint="Leave empty to use the service title.">
            <Input id="seoTitle" name="seoTitle" defaultValue={service?.seoTitle ?? ""} maxLength={190} />
          </Field>
          <Field label="SEO description" name="seoDescription" error={e.seoDescription} hint="About 150–160 characters works best.">
            <Textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={service?.seoDescription ?? ""} maxLength={320} />
          </Field>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton pending={pending} variant="dark" size="lg">
          {service ? "Save changes" : "Create service"}
        </SubmitButton>
        <Button asChild variant="ghost" size="lg">
          <Link href="/admin/services">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
