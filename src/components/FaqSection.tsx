import Link from "next/link";
import InViewMotion from "@/components/motion/InViewMotion";
import { FAQ_INTRO, NAGA_FAQS } from "@/lib/seo/faq";

type FaqSectionProps = {
  heading?: string;
  description?: string;
  contactLink?: boolean;
  className?: string;
};

export default function FaqSection({
  heading = "Frequently asked questions",
  description = FAQ_INTRO,
  contactLink = false,
  className = "",
}: FaqSectionProps) {
  return (
    <section
      className={className}
      aria-labelledby="faq-heading"
      data-cursor-section
      data-cursor-label="FAQ"
    >
      <InViewMotion reveal>
        <h2
          id="faq-heading"
          data-motion-reveal
          className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900"
        >
          {heading}
        </h2>
        <p data-motion-reveal className="mt-2 max-w-2xl text-body text-dark-700">
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
      </InViewMotion>
      <InViewMotion stagger className="mt-8 space-y-3">
        {NAGA_FAQS.map((faq) => (
          <details key={faq.question} data-motion-stagger className="naga-bezel-light group">
            <summary className="naga-bezel-light-inner cursor-pointer list-none px-5 py-4 text-body-medium text-dark-900 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] marker:content-none group-open:text-[--color-naga-gold] focus-ring rounded-sm focus-visible:outline-none">
              {faq.question}
            </summary>
            <p className="px-5 pb-4 text-body text-dark-700">{faq.answer}</p>
          </details>
        ))}
      </InViewMotion>
    </section>
  );
}
