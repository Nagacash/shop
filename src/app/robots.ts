import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

/** Never crawlable: transactional, private or authenticated surfaces. */
const DISALLOW = ["/cart", "/checkout/", "/api/", "/sign-in", "/sign-up", "/admin"];

/**
 * AI assistants that browse to answer a question and cite their sources.
 * These send real referral traffic, so they are the ones worth courting.
 */
const AI_SEARCH_AGENTS = [
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "Claude-SearchBot", // Claude search index
  "Claude-User", // Claude browsing on a user's behalf
  "Applebot", // Siri / Spotlight
];

/**
 * Model-training crawlers. They drive no direct traffic; the upside is the
 * brand becoming part of what these models know unprompted. Drop any entry
 * to opt out of that use. Note that blocking Google-Extended affects Gemini
 * only — it has no effect on Google Search ranking.
 */
const AI_TRAINING_AGENTS = ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },

      // A crawler obeys only the single most specific group matching its name
      // and does NOT inherit the wildcard group. The disallow list is repeated
      // here deliberately — without it, naming these agents would hand them
      // /admin and /checkout.
      { userAgent: AI_SEARCH_AGENTS, allow: "/", disallow: DISALLOW },
      { userAgent: AI_TRAINING_AGENTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
