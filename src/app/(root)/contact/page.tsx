import Link from "next/link";
import { Mail, MapPin, Phone, Clock, Instagram } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";

const contactDetails = [
  {
    icon: Mail,
    title: "Email",
    lines: ["support@naga-apparel.com", "We reply within 24 hours"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["Contact via naga-apparel.com", "Mon–Fri, 9am–5pm EST"],
  },
  {
    icon: MapPin,
    title: "Online Store",
    lines: ["Naga Apparel", "www.naga-apparel.com"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Mon–Fri: 9am – 5pm EST", "Weekend: email only"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        page="contact"
        eyebrow="Stay connected"
        title="Contact Naga"
        subtitle="Orders, drops, collabs — hustle grit and ultra-fine glamour, same as the feed."
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
                    <li key={line}>{line}</li>
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
      </main>
    </>
  );
}
