import ProtectedLogo from "@/components/ProtectedLogo";
import { SITE_DOMAIN, SITE_ORIGIN } from "@/lib/seo/site";
import Image from "next/image";
import Link from "next/link";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Collections",
    links: [
      { label: "Hustle Hard Drip", href: "/collections/hustle-hard-drip" },
      { label: "Naga Original", href: "/collections/naga-original" },
      { label: "Naga Black", href: "/collections/naga-black" },
      { label: "Black & Gold Edition", href: "/collections/black-gold-edition" },
      { label: "All Collections", href: "/collections" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Hoodies", href: "/products?category=hoodies" },
      { label: "Tees", href: "/products?category=tees" },
      { label: "Sweaters", href: "/products?category=sweaters" },
      { label: "Sets", href: "/products?category=sets" },
      { label: "Headwear", href: "/products?category=headwear" },
      { label: "Shop All", href: "/products" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/sign-in" },
      { label: "My Cart", href: "/cart" },
      { label: "Order Status", href: "/checkout/success" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
      { label: "Size Guide", href: "/products" },
    ],
  },
];

const socialLinks = [
  { src: "/instagram.svg", alt: "Instagram", href: "https://www.instagram.com/nagaapparel" },
  { src: "/facebook.svg", alt: "Facebook", href: "https://www.facebook.com/nagaapparel" },
  { src: "/x.svg", alt: "X", href: "https://x.com/nagaapparel" },
] as const;

const legalLinks: FooterLink[] = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: SITE_DOMAIN, href: SITE_ORIGIN },
];

const footerLinkClass =
  "focus-ring rounded-sm text-body text-light-400 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:text-[--color-naga-gold] focus-visible:outline-none";

const footerLegalLinkClass =
  "focus-ring rounded-sm transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:text-[--color-naga-gold] focus-visible:outline-none";

export default function Footer() {
  return (
    <footer className="naga-footer scroll-layer w-full">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-5 md:col-span-3">
            <Link
              href="/"
              aria-label="Naga Apparel Home"
              className="focus-ring flex items-center gap-3 rounded-sm focus-visible:outline-none"
            >
              <ProtectedLogo className="h-12 w-12" />
              <span className="naga-display text-body-medium tracking-tight">Naga Apparel</span>
            </Link>
            <p className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Berlin · Urban
            </p>
            <p className="max-w-xs text-body leading-relaxed text-light-400">
              Knowledge and quality over ignorance. Premium streetwear for the hustle — hoodies,
              tees, and sets built to last.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="naga-footer-col-title">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-3 md:col-span-2 md:justify-end">
            {socialLinks.map((s) => (
              <Link
                key={s.alt}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.alt}
                className="focus-ring naga-bezel-dark inline-flex min-h-11 min-w-11 items-center justify-center p-1 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:scale-105 focus-visible:outline-none active:scale-95"
              >
                <span className="naga-bezel-dark-inner flex h-full w-full items-center justify-center bg-dark-900">
                  <Image src={s.src} alt={s.alt} width={18} height={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-light-100/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-light-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-caption sm:justify-start">
            <Image src="/globe.svg" alt="" width={16} height={16} className="opacity-60" />
            <span>Germany</span>
            <span className="hidden text-light-100/20 sm:inline">·</span>
            <span>© 2025 Naga Apparel. All Rights Reserved</span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-4 text-caption sm:gap-6">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={footerLegalLinkClass}
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
