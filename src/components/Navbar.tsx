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

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const url = trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products";
    router.push(url);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Naga Apparel Home" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Naga Apparel"
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
          <span className="hidden text-body-medium tracking-tight text-dark-900 sm:inline">
            Naga Apparel
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body text-dark-900 transition-colors hover:text-dark-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="text-body text-dark-900 transition-colors hover:text-dark-700"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="nav-search"
          >
            Search
          </button>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-body text-dark-900 transition-colors hover:text-dark-700"
          >
            <ShoppingBag className="h-4 w-4" />
            My Cart ({cartCount})
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="block h-0.5 w-6 bg-dark-900"></span>
        </button>
      </nav>

      {searchOpen && (
        <div id="nav-search" className="border-t border-light-300 px-4 py-3 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-7xl items-center gap-3"
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-xl border border-light-300 bg-light-100 px-4 py-2.5 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="rounded-full bg-dark-900 px-5 py-2.5 text-body-medium text-light-100 hover:bg-dark-700"
            >
              Search
            </button>
            <button
              type="button"
              className="text-body text-dark-700 hover:text-dark-900"
              onClick={() => setSearchOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div
        id="mobile-menu"
        className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-body text-dark-900 hover:text-dark-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 rounded-xl border border-light-300 bg-light-100 px-3 py-2 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="rounded-full bg-dark-900 px-4 py-2 text-body-medium text-light-100"
              >
                Go
              </button>
            </form>
          </li>
          <li className="pt-2">
            <Link
              href="/cart"
              className="flex items-center gap-2 py-2 text-body text-dark-900"
              onClick={() => setOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              My Cart ({cartCount})
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
