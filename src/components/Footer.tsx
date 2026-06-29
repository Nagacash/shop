import Image from "next/image";
import Link from "next/link";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Collections",
    links: [
      { label: "Hustle Hard Drip", href: "/collections/hustle-hard-drip" },
      { label: "Naga Original", href: "/collections/naga-original" },
      { label: "Naga Green", href: "/collections/naga-green" },
      { label: "Black & Gold Edition", href: "/collections/black-gold-edition" },
      { label: "All Collections", href: "/collections" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Hoodies", href: "/products?category=hoodies" },
      { label: "Tees", href: "/products?category=tees" },
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
  { label: "Terms of Use", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "naga-apparel.com", href: "https://www.naga-apparel.com" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-dark-900 text-light-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-3">
            <Link href="/" aria-label="Naga Apparel Home" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Naga Apparel"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-body-medium tracking-tight">Naga Apparel</span>
            </Link>
            <p className="max-w-xs text-body text-light-400">
              Knowledge and quality over ignorance. Urban streetwear for the hustle.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-heading-3">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-body text-light-400 transition-colors hover:text-light-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-4 md:col-span-2 md:justify-end">
            {socialLinks.map((s) => (
              <Link
                key={s.alt}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.alt}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-100 transition-opacity hover:opacity-90"
              >
                <Image src={s.src} alt={s.alt} width={18} height={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-light-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-caption">
            <Image src="/globe.svg" alt="" width={16} height={16} />
            <span>United States</span>
            <span>© 2025 Naga Apparel. All Rights Reserved</span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-4 text-caption sm:gap-6">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-light-100"
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
