"use client";

import { saveSettings } from "@/actions/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Field, FormStatus, ImagePicker, SubmitButton, useActionForm } from "./form-kit";
import type { SiteSettingsDTO } from "@/lib/data/types";

export function SettingsForm({ settings }: { settings: SiteSettingsDTO }) {
  const [state, onSubmit, pending] = useActionForm(saveSettings);
  const e = state?.errors ?? {};
  const v = (x: string | null) => x ?? "";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormStatus state={state} />
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Company name" name="companyName" error={e.companyName}>
            <Input id="companyName" name="companyName" defaultValue={settings.companyName} required maxLength={190} />
          </Field>
          <Field label="Public email" name="companyEmail" error={e.companyEmail} hint="Shown on the contact page and footer. Leave empty to hide.">
            <Input id="companyEmail" name="companyEmail" type="email" defaultValue={v(settings.companyEmail)} />
          </Field>
          <Field label="Phone" name="phone" error={e.phone} hint="Leave empty to hide.">
            <Input id="phone" name="phone" defaultValue={v(settings.phone)} maxLength={60} />
          </Field>
          <Field label="Address" name="address" error={e.address} hint="Leave empty to hide. Line breaks are kept.">
            <Textarea id="address" name="address" rows={3} defaultValue={v(settings.address)} maxLength={500} />
          </Field>
          <Field label="Footer text" name="footerText" error={e.footerText} className="sm:col-span-2">
            <Textarea id="footerText" name="footerText" rows={2} defaultValue={v(settings.footerText)} maxLength={500} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <ImagePicker name="logoUrl" label="Logo override" defaultValue={settings.logoUrl} error={e.logoUrl} />
          <ImagePicker name="faviconUrl" label="Favicon override" defaultValue={settings.faviconUrl} error={e.faviconUrl} />
          <p className="text-xs text-muted sm:col-span-2">Leave both empty to use the built-in Luxura Tech logo and favicon.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {(
            [
              ["linkedinUrl", "LinkedIn URL", settings.linkedinUrl],
              ["xUrl", "X (Twitter) URL", settings.xUrl],
              ["facebookUrl", "Facebook URL", settings.facebookUrl],
              ["instagramUrl", "Instagram URL", settings.instagramUrl],
              ["youtubeUrl", "YouTube URL", settings.youtubeUrl],
            ] as const
          ).map(([name, label, value]) => (
            <Field key={name} label={label} name={name} error={e[name]} hint="Full https:// address. Empty hides the icon.">
              <Input id={name} name={name} type="url" defaultValue={v(value)} placeholder="https://" />
            </Field>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default search listing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field label="Default SEO title" name="defaultSeoTitle" error={e.defaultSeoTitle}>
            <Input id="defaultSeoTitle" name="defaultSeoTitle" defaultValue={v(settings.defaultSeoTitle)} maxLength={190} />
          </Field>
          <Field label="Default SEO description" name="defaultSeoDescription" error={e.defaultSeoDescription}>
            <Textarea id="defaultSeoDescription" name="defaultSeoDescription" rows={2} defaultValue={v(settings.defaultSeoDescription)} maxLength={320} />
          </Field>
          <ImagePicker name="defaultOgImage" label="Default social sharing image" defaultValue={settings.defaultOgImage} error={e.defaultOgImage} />
        </CardContent>
      </Card>

      <SubmitButton pending={pending} variant="dark" size="lg">
        Save settings
      </SubmitButton>
    </form>
  );
}
