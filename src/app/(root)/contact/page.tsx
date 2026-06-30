import Link from "next/link";
import { Mail, MapPin, Phone, Clock, Instagram } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { NAGA_FAQS } from "@/lib/seo/faq";
import { SITE_DOMAIN, SUPPORT_EMAIL } from "@/lib/seo/site";
import { MARKETING_IMAGES } from "@/lib/brand/marketing-images";

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
        imageSrc={MARKETING_IMAGES.berlinLifestyle}
        eyebrow="Stay connected"
        title="Contact Naga"
        subtitle="Naga Apparel is based in Germany. Reach us for orders, shipping, drops, and collabs — we reply within 24 hours on business days."
      >
        <a
          href="https://www.instagram.com/naga_apparel"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[--color-naga-gold]/50 bg-[--color-naga-gold]/10 px-5 py-2.5 text-body-medium text-[--color-naga-gold] transition hover:bg-[--color-naga-gold]/20"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
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
                className="rounded-xl border border-light-300 bg-light-100 p-5 transition hover:border-[--color-naga-gold]/40"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-dark-900">
                    <item.icon className="h-5 w-5 text-[--color-naga-gold]" aria-hidden="true" />
                  </span>
                  <h2 className="text-body-medium text-dark-900">{item.title}</h2>
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
            ))}
          </div>

          <div className="rounded-xl border border-light-300 bg-light-100 p-6 lg:p-8">
            <h2 className="text-body-medium text-dark-900">Send a message</h2>
            <p className="mt-1 text-caption text-dark-700">
              Fill out the form and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-light-300 pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-heading-3 text-dark-900">
            Frequently asked questions
          </h2>
          <p className="mt-2 max-w-2xl text-body text-dark-700">
            Quick answers about Naga Apparel, shipping from Germany, and our current product drop.
          </p>
          <div className="mt-8 space-y-3">
            {NAGA_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-light-300 bg-light-100 px-5 py-4"
              >
                <summary className="cursor-pointer text-body-medium text-dark-900">
                  {faq.question}
                </summary>
                <p className="mt-3 text-body text-dark-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
