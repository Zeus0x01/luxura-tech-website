"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { saveHomepageSection } from "@/actions/homepage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { CheckField, Field, FormStatus, ImagePicker, SubmitButton, useActionForm } from "./form-kit";
import type { HomepageKey } from "@/lib/validation/homepage";

export type SectionFormProps = {
  sectionKey: HomepageKey;
  label: string;
  help: string;
  values: {
    enabled: boolean;
    title: string;
    subtitle: string;
    body: string;
    image: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    items: { title: string; body: string }[];
  };
  show: { body?: boolean; image?: boolean; primaryCta?: boolean; secondaryCta?: boolean; items?: boolean };
  featured?: { label: string; options: { id: string; name: string; checked: boolean }[] };
};

type Row = { uid: number; title: string; body: string };

export function HomepageSectionForm({ sectionKey, label, help, values, show, featured }: SectionFormProps) {
  const [state, onSubmit, pending] = useActionForm(saveHomepageSection);
  const e = state?.errors ?? {};
  const nextUid = useRef(values.items.length);
  const [rows, setRows] = useState<Row[]>(values.items.map((it, i) => ({ uid: i, ...it })));

  const update = (uid: number, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.uid === uid ? { ...x, ...patch } : x)));
  const move = (index: number, dir: -1 | 1) =>
    setRows((r) => {
      const to = index + dir;
      if (to < 0 || to >= r.length) return r;
      const copy = [...r];
      [copy[index], copy[to]] = [copy[to]!, copy[index]!];
      return copy;
    });

  return (
    <Card id={sectionKey.toLowerCase()}>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{label}</CardTitle>
        <p className="text-xs text-muted">{help}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <input type="hidden" name="key" value={sectionKey} />
          <FormStatus state={state} />

          <CheckField name="enabled" label="Show this section on the homepage" defaultChecked={values.enabled} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Heading" name={`${sectionKey}-title`} error={e.title} className={show.body ? "" : "sm:col-span-2"}>
              <Input id={`${sectionKey}-title`} name="title" defaultValue={values.title} maxLength={190} aria-invalid={!!e.title} />
            </Field>
            <Field label="Subheading" name={`${sectionKey}-subtitle`} error={e.subtitle} className={show.body ? "" : "sm:col-span-2"}>
              <Textarea id={`${sectionKey}-subtitle`} name="subtitle" rows={3} defaultValue={values.subtitle} maxLength={1200} />
            </Field>
            {show.body && (
              <Field label="Body text" name={`${sectionKey}-body`} error={e.body} className="sm:col-span-2" hint="Separate paragraphs with a blank line.">
                <Textarea id={`${sectionKey}-body`} name="body" rows={6} defaultValue={values.body} maxLength={6000} />
              </Field>
            )}
            {show.image && (
              <div className="sm:col-span-2">
                <ImagePicker name="image" defaultValue={values.image} error={e.image} />
              </div>
            )}
            {show.primaryCta && (
              <>
                <Field label="Primary button label" name={`${sectionKey}-pl`} error={e.primaryCtaLabel}>
                  <Input id={`${sectionKey}-pl`} name="primaryCtaLabel" defaultValue={values.primaryCtaLabel} maxLength={60} />
                </Field>
                <Field label="Primary button link" name={`${sectionKey}-ph`} error={e.primaryCtaHref} hint="e.g. /contact or https://…">
                  <Input id={`${sectionKey}-ph`} name="primaryCtaHref" defaultValue={values.primaryCtaHref} maxLength={190} />
                </Field>
              </>
            )}
            {show.secondaryCta && (
              <>
                <Field label="Secondary button label" name={`${sectionKey}-sl`} error={e.secondaryCtaLabel}>
                  <Input id={`${sectionKey}-sl`} name="secondaryCtaLabel" defaultValue={values.secondaryCtaLabel} maxLength={60} />
                </Field>
                <Field label="Secondary button link" name={`${sectionKey}-sh`} error={e.secondaryCtaHref}>
                  <Input id={`${sectionKey}-sh`} name="secondaryCtaHref" defaultValue={values.secondaryCtaHref} maxLength={190} />
                </Field>
              </>
            )}
          </div>

          {show.items && (
            <div>
              <p className="text-sm font-medium">Items</p>
              <ul className="mt-3 space-y-3">
                {rows.map((row, i) => (
                  <li key={row.uid} className="rounded-lg border border-line bg-paper/60 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 w-6 text-center font-display text-sm font-semibold text-navy-600">{i + 1}</span>
                      <div className="grid flex-1 gap-3">
                        <Input name="itemTitle" aria-label={`Item ${i + 1} title`} placeholder="Title" value={row.title} maxLength={150} onChange={(ev) => update(row.uid, { title: ev.target.value })} />
                        <Textarea name="itemBody" aria-label={`Item ${i + 1} text`} placeholder="Text" rows={2} value={row.body} maxLength={1200} onChange={(ev) => update(row.uid, { body: ev.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button type="button" variant="ghost" size="icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                          <ArrowUp />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                          <ArrowDown />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => setRows((r) => r.filter((x) => x.uid !== row.uid))}>
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setRows((r) => [...r, { uid: nextUid.current++, title: "", body: "" }])}>
                <Plus /> Add item
              </Button>
              <p className="mt-2 text-xs text-muted">Items missing a title or text are dropped when saving.</p>
            </div>
          )}

          {featured && (
            <fieldset>
              <legend className="text-sm font-medium">{featured.label}</legend>
              <p className="mt-1 text-xs text-muted">Only published items can appear. Change the order under the section&apos;s own menu.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {featured.options.map((o) => (
                  <label key={o.id} className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                    <input type="checkbox" name="featuredIds" value={o.id} defaultChecked={o.checked} className="size-4 accent-navy-900" />
                    {o.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <SubmitButton pending={pending} variant="dark">Save {label.toLowerCase()}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
