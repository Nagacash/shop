import Link from "next/link";
import { NAGA_FAQS } from "@/lib/seo/faq";

type FaqSectionProps = {
  heading?: string;
  description?: string;
  contactLink?: boolean;
  className?: string;
};

export default function FaqSection({
  heading = "Frequently asked questions",
  description = "Quick answers about Naga Apparel, shipping from Germany, and our current product drop.",
  contactLink = false,
  className = "",
}: FaqSectionProps) {
  return (
    <section className={className} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">
        {heading}
      </h2>
      <p className="mt-2 max-w-2xl text-body text-dark-700">
        {description}
        {contactLink ? (
          <>
            {" "}
            <Link
              href="/contact"
              className="text-dark-900 underline underline-offset-2 focus-ring rounded-sm focus-visible:outline-none"
            >
              Contact us
            </Link>{" "}
            for anything else.
          </>
        ) : null}
      </p>
      <div className="mt-8 space-y-3">
        {NAGA_FAQS.map((faq) => (
          <details key={faq.question} className="naga-bezel-light group">
            <summary className="naga-bezel-light-inner cursor-pointer list-none px-5 py-4 text-body-medium text-dark-900 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] marker:content-none group-open:text-[--color-naga-gold] focus-ring rounded-sm focus-visible:outline-none">
              {faq.question}
            </summary>
            <p className="px-5 pb-4 text-body text-dark-700">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
