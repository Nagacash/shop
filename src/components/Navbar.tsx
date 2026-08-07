"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown, Search, ShoppingBag, X } from "lucide-react";
import { getCurrentCart } from "@/lib/actions/cart";

const SHOP_LINKS = [
  { label: "Shop the Drop", href: "/products" },
  { label: "Hoodies", href: "/products?category=hoodies" },
  { label: "Tees", href: "/products?category=tees" },
  { label: "Sweaters", href: "/products?category=sweaters" },
  { label: "Sets", href: "/products?category=sets" },
  { label: "Headwear", href: "/products?category=headwear" },
] as const;

const DISCOVER_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Podcast", href: "/podcast" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

function isNavActive(href: string, pathname: string, searchParams: URLSearchParams) {
  if (href === "/products") {
    return pathname === "/products" && !searchParams.get("category") && !searchParams.get("search");
  }
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

function isShopActive(pathname: string, searchParams: URLSearchParams) {
  return pathname === "/products" || SHOP_LINKS.some((l) => isNavActive(l.href, pathname, searchParams));
}

function NavWordmark() {
  return (
    <span className="naga-nav-wordmark naga-nav-wordmark--solo">
      <span className="naga-display block text-[1.0625rem] font-bold leading-none tracking-tighter text-dark-900">
        Naga
      </span>
      <span className="mt-1 block text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-[--color-naga-gold]">
        Apparel
      </span>
    </span>
  );
}

/** Static shell used for SSR + first client paint to avoid useSearchParams hydration drift. */
export function NavbarFallback() {
  return (
    <header className="naga-nav-shell" data-nav-shell>
      <nav className="naga-nav-island" aria-label="Primary">
        <Link
          href="/"
          aria-label="Naga Apparel Home"
          className="naga-nav-brand focus-ring focus-visible:outline-none"
        >
          <NavWordmark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex" aria-hidden="true">
          <span className="naga-nav-link naga-nav-link--shop">Shop</span>
          {DISCOVER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-nav-link-item className="naga-nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="naga-nav-icon-btn hidden lg:inline-flex" aria-hidden="true">
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <Link href="/cart" className="naga-nav-bag focus-ring focus-visible:outline-none">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden sm:inline">Bag</span>
          </Link>
          <span className="naga-nav-menu-btn lg:hidden" aria-hidden="true">
            <span className="naga-nav-menu-line" />
            <span className="naga-nav-menu-line" />
            <span className="naga-nav-menu-line" />
          </span>
        </div>
      </nav>
    </header>
  );
}

function NavbarInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const shopActive = isShopActive(pathname, searchParams);

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
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

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuBtn = menuBtnRef.current;
    closeBtnRef.current?.focus();

    const getFocusable = () => {
      const root = drawerRef.current;
      if (!root) return [] as HTMLElement[];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? menuBtn)?.focus();
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!shopOpen) return;
    const close = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [shopOpen]);

  useEffect(() => {
    setShopOpen(false);
    setSearchOpen(false);
    setOpen(false);
  }, [pathname, searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const url = trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products";
    router.push(url);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header className="naga-nav-shell" data-nav-shell>
      <nav
        className={`naga-nav-island ${scrolled ? "naga-nav-island--scrolled" : ""} ${searchOpen ? "naga-nav-island--search" : ""}`}
        aria-label="Primary"
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="Naga Apparel Home"
          className="naga-nav-brand focus-ring focus-visible:outline-none"
        >
          <NavWordmark />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <div ref={shopRef} className="relative">
            <button
              type="button"
              className={`naga-nav-link naga-nav-link--shop ${shopActive ? "naga-nav-link--active" : ""}`}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              onClick={() => setShopOpen((v) => !v)}
            >
              Shop
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-[var(--duration-normal)] ${shopOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>

            {shopOpen && (
              <div className="naga-nav-dropdown" role="menu">
                <p className="naga-nav-dropdown-label">Categories</p>
                <ul className="grid gap-0.5">
                  {SHOP_LINKS.map((l) => {
                    const active = isNavActive(l.href, pathname, searchParams);
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          role="menuitem"
                          className={`naga-nav-dropdown-link ${active ? "naga-nav-dropdown-link--active" : ""}`}
                          onClick={() => setShopOpen(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {DISCOVER_LINKS.map((l) => {
            const active = isNavActive(l.href, pathname, searchParams);
            return (
              <Link
                key={l.href}
                href={l.href}
                data-nav-link-item
                className={`naga-nav-link ${active ? "naga-nav-link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form
              onSubmit={handleSearch}
              className="naga-nav-search hidden min-w-0 flex-1 items-center gap-2 lg:flex"
              id="nav-search"
            >
              <Search className="h-4 w-4 shrink-0 text-dark-500" strokeWidth={1.5} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drops…"
                className="naga-nav-search-input"
                aria-label="Search products"
              />
              <button type="submit" className="naga-nav-search-submit">
                Go
              </button>
              <button
                type="button"
                className="naga-nav-icon-btn"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                className="naga-nav-icon-btn hidden lg:inline-flex"
                aria-label="Search products"
                aria-expanded={searchOpen}
                aria-controls="nav-search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <Link href="/cart" className="naga-nav-bag focus-ring focus-visible:outline-none">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="naga-nav-bag-count" aria-label={`${cartCount} items in bag`}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <button
            ref={menuBtnRef}
            type="button"
            className="naga-nav-menu-btn focus-ring lg:hidden"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className={`naga-nav-menu-line ${open ? "naga-nav-menu-line--top-open" : ""}`} />
            <span className={`naga-nav-menu-line ${open ? "naga-nav-menu-line--mid-open" : ""}`} />
            <span className={`naga-nav-menu-line ${open ? "naga-nav-menu-line--bot-open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <button
            type="button"
            className="naga-mobile-overlay lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            ref={drawerRef}
            id="mobile-menu"
            className="naga-mobile-drawer lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="naga-mobile-drawer-head">
              <p className="naga-nav-dropdown-label">Menu</p>
              <button
                ref={closeBtnRef}
                type="button"
                className="naga-nav-icon-btn naga-nav-icon-btn--light"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="naga-mobile-drawer-section">
              <p className="naga-nav-dropdown-label">Shop</p>
              <ul className="space-y-0.5">
                {SHOP_LINKS.map((l, i) => {
                  const active = isNavActive(l.href, pathname, searchParams);
                  return (
                    <li
                      key={l.href}
                      style={{ animationDelay: `${60 + i * 35}ms` }}
                      className="naga-mobile-drawer-item"
                    >
                      <Link
                        href={l.href}
                        className={`naga-mobile-drawer-link ${active ? "naga-mobile-drawer-link--active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="naga-mobile-drawer-section">
              <p className="naga-nav-dropdown-label">Discover</p>
              <ul className="space-y-0.5">
                {DISCOVER_LINKS.map((l, i) => {
                  const active = isNavActive(l.href, pathname, searchParams);
                  return (
                    <li
                      key={l.href}
                      style={{ animationDelay: `${220 + i * 35}ms` }}
                      className="naga-mobile-drawer-item"
                    >
                      <Link
                        href={l.href}
                        className={`naga-mobile-drawer-link ${active ? "naga-mobile-drawer-link--active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <form onSubmit={handleSearch} className="naga-mobile-drawer-search">
              <Search className="h-4 w-4 shrink-0 text-light-400" strokeWidth={1.5} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drops…"
                className="naga-mobile-drawer-search-input"
                aria-label="Search products"
              />
              <button type="submit" className="naga-nav-search-submit naga-nav-search-submit--gold">
                Go
              </button>
            </form>

            <Link href="/cart" className="naga-btn naga-btn-gold w-full" onClick={() => setOpen(false)}>
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Bag · {cartCount} item{cartCount === 1 ? "" : "s"}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default function Navbar() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <NavbarFallback />;
  }

  return <NavbarInteractive />;
}
