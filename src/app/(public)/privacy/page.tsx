import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";
import { getSiteSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Luxura Tech USA LLC collects, uses, and protects information submitted through this website.",
  path: "/privacy",
});

// NOTE: This is a plain-language starting draft that matches how the site
// actually works. Have qualified counsel review it before launch.
export default async function PrivacyPage() {
  const s = await getSiteSettings();
  const contact = s.companyEmail ? (
    <a href={`mailto:${s.companyEmail}`}>{s.companyEmail}</a>
  ) : (
    <>the contact form on this website</>
  );
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>
        This policy explains what information {s.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this website, how we use it, and the
        choices you have.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you submit the contact form we collect the details you provide: your name, company, email address, phone number, country, the service you are
        interested in, your preferred contact method, and your message. We do not ask for payment information or sensitive personal data.
      </p>
      <h2>How we use it</h2>
      <ul>
        <li>To respond to your request and follow up about a possible engagement.</li>
        <li>To keep a record of enquiries so we can manage them internally.</li>
        <li>To protect the website from spam and abuse.</li>
      </ul>
      <p>We do not sell your information.</p>
      <h2>Who processes it</h2>
      <p>
        Your submission is stored in our database and an email notification is sent to our team through our email delivery provider (Resend). Our hosting
        provider stores and serves the website. These providers process information on our behalf.
      </p>
      <h2>Cookies</h2>
      <p>
        The public website does not use advertising or analytics cookies. A strictly necessary session cookie is used only by authorized staff when they sign in
        to the administration area.
      </p>
      <h2>Retention</h2>
      <p>We keep enquiries for as long as needed to respond and to maintain a reasonable business record, then delete or archive them.</p>
      <h2>Your choices</h2>
      <p>You may ask us to access, correct, or delete the information you sent us by contacting us via {contact}.</p>
      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date above shows when it was last revised.</p>
    </LegalPage>
  );
}
