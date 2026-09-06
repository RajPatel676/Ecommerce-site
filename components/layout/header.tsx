"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";
import { LanguagePicker } from "@/components/i18n/language-picker";
import { ThemePicker } from "@/components/theme/theme-picker";

import type { Dict } from "@/lib/i18n";

export const navItems = (t: Dict) => [
  { href: "/", label: t.nav.home },
  { href: "/shop", label: t.nav.shop },
  { href: "/about", label: t.nav.story },
  { href: "/contact", label: t.nav.contact },
];

export function Header() {
  const pathname = usePathname();
  const { cartCount, setCartOpen, setSearchOpen, setMenuOpen, hydrated, wishlist } =
    useStore();
  const t = useT();
  const NAV = navItems(t);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl-K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* announcement bar */}
      <div className="relative z-40 bg-inverse text-on-inverse">
        <div className="container flex h-9 items-center justify-center gap-2 text-center text-[0.72rem] tracking-wide sm:text-[0.78rem]">
          <span className="h-1 w-1 rounded-full bg-mustard-300" aria-hidden />
          <span>{t.nav.announcement}</span>
          <span className="hidden text-on-inverse/50 sm:inline">·</span>
          <span className="hidden text-on-inverse/70 sm:inline">
            {t.nav.announcementSub}
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-cream-400 bg-cream-100/90 backdrop-blur-md shadow-soft"
            : "border-transparent bg-cream-100",
        )}
      >
        <div className="container flex h-16 items-center gap-3 lg:h-[4.75rem]">
          {/* mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.nav.openMenu}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 lg:flex-none">
            <Logo className="max-lg:mx-auto max-lg:items-center" />
          </div>

          {/* desktop nav */}
          <nav
            aria-label="Primary"
            className="mx-auto hidden items-center gap-9 lg:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-[0.9rem] transition-colors",
                  isActive(item.href)
                    ? "font-medium text-terracotta-500"
                    : "text-clay-500 hover:text-terracotta-500",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "stitch-line absolute -bottom-0.5 left-0 w-full transition-opacity",
                    isActive(item.href) ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.openSearch}
              className="grid h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </button>

            <LanguagePicker />
            <ThemePicker />

            <Link
              href="/wishlist"
              aria-label={t.nav.wishlist}
              className="relative hidden h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500 sm:grid"
            >
              <Heart className="h-[1.15rem] w-[1.15rem]" />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta-500" />
              )}
            </Link>

            <Link
              href="/account"
              aria-label={t.nav.account}
              className="hidden h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500 sm:grid"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`${t.nav.cartLabel}, ${hydrated ? cartCount : 0}`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-terracotta-500 px-1 text-[0.62rem] font-bold text-on-accent">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
