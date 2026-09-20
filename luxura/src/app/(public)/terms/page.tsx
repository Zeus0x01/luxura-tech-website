import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";
import { getSiteSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms governing use of the Luxura Tech USA LLC website.",
  path: "/terms",
});

// NOTE: Starting draft. Have qualified counsel review it before launch.
export default async function TermsPage() {
  const s = await getSiteSettings();
  return (
    <LegalPage title="Terms of Use" updated="September 2026">
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the site. The website is operated by {s.companyName}.
      </p>
      <h2>Informational purposes</h2>
      <p>
        Content on this website is provided for general information about our services. It is not professional, legal, financial, or technical advice, and
        submitting the contact form does not create a client relationship or any obligation on either side.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The website, including its text, design, logos, and images, is owned by or licensed to {s.companyName} and protected by applicable intellectual
        property laws. You may not copy or reuse it without written permission.
      </p>
      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse the site, including attempting to gain unauthorized access, interfering with its operation, or submitting unlawful, misleading,
        or automated content through its forms.
      </p>
      <h2>No warranties</h2>
      <p>
        We work to keep the information accurate and the site available, but it is provided &ldquo;as is&rdquo; without warranties of any kind, to the fullest
        extent permitted by law.
      </p>
      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of the website.</p>
      <h2>Third-party links</h2>
      <p>The site may link to third-party websites. We are not responsible for their content or practices.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>
    </LegalPage>
  );
}
