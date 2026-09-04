import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { SOCIAL_SHARE_IMAGE } from "@/lib/brand/marketing-images";
import { absoluteUrl, getSiteUrl, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "@/lib/seo/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Carries brand + category + city + reach. The previous title named the
// product types but not where the brand is from or that it ships beyond
// Germany, so it could realistically only compete on brand-name searches.
const defaultTitle = `${SITE_NAME} — Streetwear Brand from Hamburg | Shipping Worldwide`;

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(SOCIAL_SHARE_IMAGE),
        alt: "Naga Original black set still life with hangtag and gold hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SOCIAL_SHARE_IMAGE)],
  },
  icons: { icon: "/logo.png" },
  category: "shopping",
};

export default function RootShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="naga-root">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3046731118429407"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${inter.className} ${inter.variable} naga-site naga-brutalist min-h-full antialiased`}
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
