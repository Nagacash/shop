import Link from "next/link";
import { Mail, MapPin, Phone, Clock, Instagram } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/FaqSection";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { NAGA_FAQS } from "@/lib/seo/faq";
import { SITE_DOMAIN, SUPPORT_EMAIL } from "@/lib/seo/site";
import { MARKETING_IMAGES, SECTION_CLIPS } from "@/lib/brand/marketing-images";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Contact Naga Apparel",
  description:
    `Contact Naga Apparel in Germany — orders, shipping, collabs, and support. Email ${SUPPORT_EMAIL}. We reply within 24 hours.`,
  path: "/contact",
  image: MARKETING_IMAGES.berlinLifestyle,
});

const contactDetails = [
  {
    icon: Mail,
    title: "Email",
    lines: [SUPPORT_EMAIL, "We reply within 24 hours"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: [`Contact via ${SITE_DOMAIN}`, "Mon–Fri, 9am–5pm CET"],
  },
  {
    icon: MapPin,
    title: "Online Store",
    lines: ["Naga Apparel", `Germany · ${SITE_DOMAIN}`],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Mon–Fri: 9am – 5pm CET", "Weekend: email only"],
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd([...NAGA_FAQS])} />
      <PageHero
        clipId={SECTION_CLIPS.contact}
        imageSrc={MARKETING_IMAGES.berlinLifestyle}
        eyebrow="Stay connected"
        title="Contact Naga"
        subtitle="Naga Apparel is based in Germany. Reach us for orders, shipping, drops, and collabs — we reply within 24 hours on business days."
      >
        <a
          href="https://www.instagram.com/naga_apparel"
          target="_blank"
          rel="noopener noreferrer"
          className="naga-btn naga-btn-outline-light mt-6 focus-ring focus-visible:outline-none"
        >
          <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          @naga_apparel
        </a>
      </PageHero>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">Home</Link> /{" "}
          <span className="text-dark-900">Contact</span>
        </nav>

        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contactDetails.map((item) => (
              <div
                key={item.title}
                className="naga-bezel-light transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:scale-[1.01]"
              >
                <div className="naga-bezel-light-inner p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-dark-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <item.icon className="h-4 w-4 text-[--color-naga-gold]" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h2 className="naga-display text-body-medium text-dark-900">{item.title}</h2>
                </div>
                <ul className="mt-4 space-y-1 text-body text-dark-700">
                  {item.lines.map((line) => (
                    <li key={line}>
                      {item.title === "Email" ? (
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-dark-900 underline">
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="naga-bezel-light">
            <div className="naga-bezel-light-inner p-6 lg:p-8">
            <h2 className="naga-display text-body-medium text-dark-900">Send a message</h2>
            <p className="mt-1 text-caption text-dark-700">
              Fill out the form and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
            </div>
          </div>
        </section>

        <FaqSection className="mt-20 border-t border-dark-900/8 pt-14" />
      </main>
    </>
  );
}
