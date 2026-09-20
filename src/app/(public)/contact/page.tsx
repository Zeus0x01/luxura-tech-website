import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublishedServices, getSiteSettings } from "@/lib/data/public";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Request a consultation with Luxura Tech USA LLC. Tell us about your goals and we will be in touch.",
  path: "/contact",
});

export default async function ContactPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSiteSettings()]);
  const options = services.map((s) => ({ id: s.id, slug: s.slug, title: s.title }));

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a Consultation"
        subtitle="Tell us about your organization and what you would like to achieve. We will review your message and respond personally."
      />
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:order-2">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
              <ContactForm services={options} />
            </Suspense>
          </div>
          <aside className="lg:col-span-5 lg:order-1">
            <h2 className="font-display text-2xl font-semibold text-navy-950">What happens next</h2>
            <ol className="mt-6 space-y-5">
              {[
                ["Share your context", "A few details about your organization and goals are enough to begin."],
                ["We review it personally", "Your message goes to our team, not an automated queue."],
                ["We follow up", "We reach out by the method you prefer to discuss a sensible next step."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-semibold text-lime-400">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-navy-950">{title}</p>
                    <p className="mt-1 text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {(settings.companyEmail || settings.phone || settings.address) && (
              <div className="mt-10 space-y-4 border-t border-line pt-8 text-navy-800">
                {settings.companyEmail && (
                  <p className="flex items-start gap-3">
                    <Mail className="mt-1 size-4 text-navy-600" />
                    <a href={`mailto:${settings.companyEmail}`} className="break-all hover:text-brand">{settings.companyEmail}</a>
                  </p>
                )}
                {settings.phone && (
                  <p className="flex items-start gap-3">
                    <Phone className="mt-1 size-4 text-navy-600" />
                    <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-brand">{settings.phone}</a>
                  </p>
                )}
                {settings.address && (
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-1 size-4 text-navy-600" />
                    <span className="whitespace-pre-line">{settings.address}</span>
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
