"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { getCurrentCart } from "@/lib/actions/cart";

const NAV_LINKS = [
  { label: "Hoodies", href: "/products?category=hoodies" },
  { label: "Tees", href: "/products?category=tees" },
  { label: "Sweaters", href: "/products?category=sweaters" },
  { label: "Sets", href: "/products?category=sets" },
  { label: "Headwear", href: "/products?category=headwear" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

function isNavActive(href: string, pathname: string, searchParams: URLSearchParams) {
  if (href.startsWith("/products?")) {
    const category = new URL(href, "http://local").searchParams.get("category");
    return (
      pathname === "/products" &&
      searchParams.get("category") === category &&
      !searchParams.get("search")
    );
  }
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function navLinkClass(active: boolean) {
  return ["focus-ring focus-visible:outline-none", active ? "naga-nav-link naga-nav-link--active" : "naga-nav-link"].join(
    " ",
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    getCurrentCart().then((cart) => {
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
    });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const url = trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products";
    router.push(url);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header className="naga-nav-shell">
      <nav className="naga-nav-island" aria-label="Primary">
        <Link
          href="/"
          aria-label="Naga Apparel Home"
          className="focus-ring flex items-center gap-2.5 rounded-full focus-visible:outline-none sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt="Naga Apparel"
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full object-cover ring-1 ring-dark-900/10 sm:h-10 sm:w-10"
          />
          <span className="naga-display hidden text-body-medium tracking-tight text-dark-900 sm:inline">
            Naga Apparel
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = isNavActive(l.href, pathname, searchParams);
            return (
              <li key={l.href}>
                <Link href={l.href} className={navLinkClass(active)} aria-current={active ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="naga-nav-link focus-ring focus-visible:outline-none"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="nav-search"
          >
            Search
          </button>
          <Link
            href="/cart"
            className="naga-nav-link focus-ring inline-flex items-center gap-1.5 focus-visible:outline-none"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex min-h-11 min-w-11 flex-col items-center justify-center rounded-full focus-visible:outline-none lg:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span
            className={`block h-0.5 w-5 origin-center bg-dark-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-[5px] rotate-45" : ""}`}
          />
          <span
            className={`my-1.5 block h-0.5 w-5 bg-dark-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "scale-x-0 opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 origin-center bg-dark-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {searchOpen && (
        <div id="nav-search" className="mx-auto mt-3 max-w-3xl px-4">
          <form
            onSubmit={handleSearch}
            className="naga-bezel-light flex items-center gap-3 p-2"
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="naga-input flex-1 border-0 bg-transparent shadow-none focus-visible:shadow-none"
              aria-label="Search products"
            />
            <button type="submit" className="naga-btn naga-btn-dark shrink-0">
              Search
            </button>
            <button
              type="button"
              className="shrink-0 px-2 text-body text-dark-700 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:text-dark-900"
              onClick={() => setSearchOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {open && (
        <>
          <div
            className="naga-mobile-overlay lg:hidden"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div id="mobile-menu" className="naga-mobile-panel lg:hidden">
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => {
                const active = isNavActive(l.href, pathname, searchParams);
                return (
                  <li
                    key={l.href}
                    style={{ animationDelay: `${80 + i * 40}ms` }}
                    className="animate-[naga-panel-in_500ms_var(--ease-premium)_both]"
                  >
                    <Link
                      href={l.href}
                      className={`block min-h-11 rounded-xl px-3 py-2.5 ${navLinkClass(active)}`}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-dark-900/8 pt-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="naga-input flex-1 py-2.5"
                    aria-label="Search products"
                  />
                  <button type="submit" className="naga-btn naga-btn-dark shrink-0">
                    Go
                  </button>
                </form>
              </li>
              <li className="pt-2">
                <Link
                  href="/cart"
                  className="naga-btn naga-btn-gold w-full"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  My Bag ({cartCount})
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
