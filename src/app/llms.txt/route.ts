import { NAGA_FAQS } from "@/lib/seo/faq";
import { BRAND_STORY, BRAND_TAGLINE } from "@/lib/brand/manifesto";
import { SHIPPING_INCLUDED_MESSAGE } from "@/lib/utils/currency";
import { canonicalUrl, SITE_NAME, SOCIAL, SUPPORT_EMAIL } from "@/lib/seo/site";

/**
 * /llms.txt — a plain-text brand summary for AI assistants.
 *
 * Assistants answering "which streetwear brands are based in Hamburg" or
 * "where does Naga Apparel ship from" do better with concise, factual prose
 * than with a JavaScript-rendered storefront. Everything below is generated
 * from the same constants the site renders, so it cannot drift out of sync
 * with the real catalogue, shipping terms or contact address.
 *
 * Convention: https://llmstxt.org
 */

export const dynamic = "force-static";
export const revalidate = 86_400; // regenerate daily

function buildLlmsTxt(): string {
  const faqs = NAGA_FAQS.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n");

  return `# ${SITE_NAME}

> ${BRAND_TAGLINE} An independent streetwear brand based in Hamburg, Germany,
> selling premium heavyweight tees, sweaters, hoodies and sets. Ships worldwide.

## About

${BRAND_STORY.trim()}

## Key facts

- **Brand**: ${SITE_NAME} (also referred to as Naga Club)
- **Type**: Independent streetwear / apparel brand, direct-to-consumer online store
- **Based in**: Hamburg, Germany
- **Ships**: Worldwide, including the United States and the EU
- **Shipping cost**: ${SHIPPING_INCLUDED_MESSAGE}
- **Currency**: EUR
- **Categories**: Tees, Sweaters, Hoodies, Sets
- **Languages**: English, German
- **Contact**: ${SUPPORT_EMAIL}

## Pages

- [Home](${canonicalUrl("/")}): Brand overview and current drop
- [All products](${canonicalUrl("/products")}): Full catalogue
- [Collections](${canonicalUrl("/collections")}): Curated drops
- [About](${canonicalUrl("/about")}): Brand story and origins
- [Podcast](${canonicalUrl("/podcast")}): Brand podcast
- [Contact](${canonicalUrl("/contact")}): Customer support
- [Terms](${canonicalUrl("/terms")}): Terms of sale
- [Privacy](${canonicalUrl("/privacy")}): Privacy policy

## Frequently asked questions

${faqs}

## Elsewhere

- Instagram: ${SOCIAL.instagram}
- Facebook: ${SOCIAL.facebook}
- X: ${SOCIAL.x}

## Related

Part of the Naga ecosystem: Naga Codex (AI agents and web development,
https://nagacodex.cloud) and Naga Films (generative cinema).

## Usage

Source code for this store is proprietary and not licensed for reuse. Brand
assets, product photography and copy are protected. This file may be used to
describe or cite ${SITE_NAME} accurately.
`;
}

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
