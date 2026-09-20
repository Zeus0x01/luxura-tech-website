"use client";

import Link from "next/link";
import { saveIndustry } from "@/actions/industries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { CheckField, Field, FormStatus, IconSelect, ImagePicker, StatusSelect, SubmitButton, useActionForm } from "./form-kit";

type Props = {
  industry?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    icon: string | null;
    status: "DRAFT" | "PUBLISHED";
    featured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
  };
};

export function IndustryForm({ industry }: Props) {
  const [state, onSubmit, pending] = useActionForm(saveIndustry.bind(null, industry?.id ?? null));
  const e = state?.errors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormStatus state={state} />
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" error={e.name}>
            <Input id="name" name="name" defaultValue={industry?.name} required maxLength={120} aria-invalid={!!e.name} />
          </Field>
          <Field label="URL slug" name="slug" error={e.slug} hint="Appears in the address: /industries/your-slug">
            <Input id="slug" name="slug" defaultValue={industry?.slug} required maxLength={100} aria-invalid={!!e.slug} />
          </Field>
          <Field label="Description" name="description" error={e.description} className="sm:col-span-2" hint="Separate paragraphs with a blank line.">
            <Textarea id="description" name="description" rows={6} defaultValue={industry?.description} required aria-invalid={!!e.description} />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance & visibility</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <ImagePicker name="image" defaultValue={industry?.image} error={e.image} />
          <div className="space-y-5">
            <IconSelect name="icon" defaultValue={industry?.icon} error={e.icon} />
            <StatusSelect defaultValue={industry?.status ?? "DRAFT"} />
            <CheckField name="featured" label="Featured on the homepage" defaultChecked={industry?.featured} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Search engine listing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field label="SEO title" name="seoTitle" error={e.seoTitle} hint="Leave empty to use the industry name.">
            <Input id="seoTitle" name="seoTitle" defaultValue={industry?.seoTitle ?? ""} maxLength={190} />
          </Field>
          <Field label="SEO description" name="seoDescription" error={e.seoDescription}>
            <Textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={industry?.seoDescription ?? ""} maxLength={320} />
          </Field>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <SubmitButton pending={pending} variant="dark" size="lg">
          {industry ? "Save changes" : "Create industry"}
        </SubmitButton>
        <Button asChild variant="ghost" size="lg">
          <Link href="/admin/industries">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
