import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_DOMAIN, SITE_NAME, SUPPORT_EMAIL } from "@/lib/seo/site";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Naga Apparel. Learn how we collect, use, and protect your personal data when you shop at nagaclub.de.",
  path: "/privacy",
});

const sections = [
  {
    title: "Overview",
    content: `This Privacy Policy explains how ${SITE_NAME} ("we", "us") collects, uses, stores, and protects personal information when you visit ${SITE_DOMAIN}, create an account, place an order, or contact us. We process personal data in accordance with the EU General Data Protection Regulation (GDPR) and applicable German data protection law.`,
  },
  {
    title: "Who Is Responsible",
    content: `The data controller for this website is ${SITE_NAME}, operating from Germany. For privacy-related questions or requests, contact us at ${SUPPORT_EMAIL}.`,
  },
  {
    title: "Information We Collect",
    subsections: [
      {
        heading: "Account information",
        content:
          "When you register, we collect your name, email address, and authentication details needed to secure your account.",
      },
      {
        heading: "Order information",
        content:
          "When you purchase, we collect billing and shipping details, order history, and information needed to fulfil your order.",
      },
      {
        heading: "Payment information",
        content:
          "Payments are processed by Stripe. We do not store full card numbers on our servers. Stripe may collect payment and fraud-prevention data according to its own privacy policy.",
      },
      {
        heading: "Contact and support",
        content:
          "If you contact us by email or through our contact form, we collect the information you provide so we can respond to your request.",
      },
      {
        heading: "Technical data",
        content:
          "We may collect technical information such as IP address, browser type, device information, and cookies required for site security, session management, and checkout functionality.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content:
      "We use personal data to operate the website, create and manage accounts, process orders and payments, deliver products, provide customer support, prevent fraud, comply with legal obligations, and improve our services. We do not sell your personal data.",
  },
  {
    title: "Legal Bases for Processing",
    content:
      "Depending on the situation, we process personal data based on: performance of a contract (for example, fulfilling your order), legitimate interests (for example, site security and fraud prevention), legal obligations, and your consent where required (for example, optional marketing communications if offered).",
  },
  {
    title: "Sharing With Service Providers",
    content:
      "We share personal data only when necessary with trusted service providers that help us run the store, such as hosting, database, authentication, payment processing, and email delivery providers. These providers may only use the data to perform services for us and must protect it appropriately.",
  },
  {
    title: "International Transfers",
    content:
      "Some service providers may process data outside the European Economic Area. Where this occurs, we rely on appropriate safeguards such as standard contractual clauses or equivalent protections required under GDPR.",
  },
  {
    title: "Data Retention",
    content:
      "We retain personal data only for as long as necessary to fulfil the purposes described in this policy, including order records, tax and accounting obligations, dispute resolution, and legal compliance.",
  },
  {
    title: "Your Rights",
    content:
      "Under GDPR, you may have the right to access, rectify, erase, restrict, or object to certain processing of your personal data, and to data portability where applicable. You may also withdraw consent at any time where processing is based on consent, and lodge a complaint with a supervisory authority. To exercise your rights, email us at the address below.",
  },
  {
    title: "Cookies",
    content:
      "We use cookies and similar technologies that are necessary for authentication, cart functionality, checkout, and site security. You can control cookies through your browser settings, but disabling essential cookies may affect how the site works.",
  },
  {
    title: "Children",
    content:
      "Our website is not intended for children under 16, and we do not knowingly collect personal data from children.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. When we do, we will revise the \"Last Updated\" date below. Material changes will be posted on this page.",
  },
  {
    title: "Contact",
    content: `If you have questions about this Privacy Policy or how we handle personal data, contact us at ${SUPPORT_EMAIL}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="naga-legal-hero">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-caption text-dark-700">
            <Link href="/" className="transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:text-dark-900">
              Home
            </Link>{" "}
            / <span className="text-dark-900">Privacy Policy</span>
          </nav>
          <p className="naga-eyebrow">
            <span className="naga-eyebrow-dot" aria-hidden="true" />
            Legal
          </p>
          <h1 className="naga-display mt-4 text-heading-2 font-bold tracking-tighter text-dark-900 sm:text-heading-1">
            Privacy Policy
          </h1>
          <p className="mt-2 text-body text-dark-700">Last Updated: June 2025</p>
        </div>
      </div>

      <main className="naga-legal-prose mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <hr className="naga-legal-divider" />

        <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-heading-3">{section.title}</h2>
            {"subsections" in section && section.subsections ? (
              <div className="mt-4 space-y-6">
                {section.subsections.map((sub) => (
                  <div key={sub.heading}>
                    <h3 className="text-body-medium text-dark-900">{sub.heading}</h3>
                    <p className="mt-1 text-body text-dark-700">{sub.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-body text-dark-700">{section.content}</p>
            )}
          </section>
        ))}
      </div>

      <p className="mt-10 text-body text-dark-700">
        Email:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-dark-900 underline">
          {SUPPORT_EMAIL}
        </a>
      </p>
      </main>
    </>
  );
}
