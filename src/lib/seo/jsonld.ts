import { absoluteUrl, canonicalUrl, LEGAL_OPERATOR, SITE_DESCRIPTION, SITE_NAME, SOCIAL, SUPPORT_EMAIL } from "./site";
import { CURRENCY_CODE } from "@/lib/utils/currency";

/**
 * Organization entity.
 *
 * Typed as OnlineStore (a schema.org subtype of Organization) so the brand is
 * understood as a retailer rather than a generic company. Deliberately NOT
 * LocalBusiness: that type asserts a walk-in location customers can visit, and
 * claiming it without a physical shop misrepresents the business.
 *
 * areaServed + foundingLocation give the two signals the brand actually needs
 * — rooted in Hamburg, selling internationally.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    name: SITE_NAME,
    alternateName: "Naga Club",
    url: canonicalUrl("/"),
    logo: absoluteUrl("/logo2.png"),
    image: absoluteUrl("/logo2.png"),
    description: SITE_DESCRIPTION,
    slogan: "Ancient Wisdom. Modern Hustle.",
    sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.x, SOCIAL.website],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
      logo: absoluteUrl("/logo2.png"),
    },
    knowsAbout: ["Streetwear", "Apparel", "Fashion", "Independent clothing brands"],
    knowsLanguage: ["en", "de"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SUPPORT_EMAIL,
      telephone: LEGAL_OPERATOR.phone,
      availableLanguage: ["English", "German"],
    },
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hamburg",
      postalCode: "20355",
      addressCountry: "DE",
    },
    // Ships internationally — states reach explicitly rather than leaving it
    // to be inferred from the .de address alone.
    areaServed: [
      { "@type": "Country", name: "Germany" },
      { "@type": "Place", name: "Europe" },
      { "@type": "Place", name: "Worldwide" },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: canonicalUrl("/"),
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/products")}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image: string;
  price: number;
  inStock: boolean;
  sku?: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: absoluteUrl(input.image),
    sku: input.sku,
    brand: {
      "@type": "Brand",
      name: input.brand ?? SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(input.path),
      priceCurrency: CURRENCY_CODE,
      price: input.price.toFixed(2),
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
