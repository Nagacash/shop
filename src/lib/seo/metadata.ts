import type { Metadata } from "next";
import { SOCIAL_SHARE_IMAGE } from "@/lib/brand/marketing-images";
import { absoluteUrl, canonicalUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = SOCIAL_SHARE_IMAGE,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = canonicalUrl(path);
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
