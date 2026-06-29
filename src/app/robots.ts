import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout/", "/api/", "/sign-in", "/sign-up"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
