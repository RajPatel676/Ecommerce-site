"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ChevronRight,
  Heart,
  MapPin,
  Package,
  Phone,
  User,
  X,
} from "lucide-react";
import { navItems } from "@/components/layout/header";
import { Logo } from "@/components/layout/logo";
import { CATEGORIES } from "@/lib/data/products";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const secondary = (t: Dict) => [
  { href: "/account", label: t.nav.account, icon: User },
  { href: "/wishlist", label: t.nav.wishlist, icon: Heart },
  { href: "/track", label: t.nav.track, icon: Package },
  { href: "/faq", label: t.nav.help, icon: Phone },
];

export function MobileNav() {
  const { menuOpen, setMenuOpen } = useStore();
  const pathname = usePathname();
  const t = useT();
  const NAV = navItems(t);
  const SECONDARY = secondary(t);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenuOpen]);

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div
        className="absolute inset-0 animate-fade-in bg-inverse/40 backdrop-blur-[2px]"
        onClick={() => setMenuOpen(false)}
      />
      <nav className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-slide-in-left flex-col bg-cream-100 shadow-drawer">
        <div className="flex items-center justify-between border-b border-cream-400 px-5 py-4">
          <Logo size="sm" onClick={() => setMenuOpen(false)} />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t.nav.closeMenu}
            className="grid h-10 w-10 place-items-center rounded-full text-clay-400 transition-colors hover:bg-cream-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <ul className="px-3 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg transition-colors",
                    pathname === item.href
                      ? "bg-terracotta-50 text-terracotta-500"
                      : "text-clay-600 hover:bg-cream-200",
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-clay-200" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-6 pb-2 pt-1">
            <p className="kicker">{t.nav.shopByCategory}</p>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 px-5 pb-5">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link
                  href={`/shop?category=${c.key}`}
                  className="group block overflow-hidden rounded-xl border border-cream-400 bg-card"
                >
                  <div className="relative aspect-[5/3] w-full">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="px-2.5 py-2 text-[0.78rem] font-medium leading-tight text-clay-500">
                    {c.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="border-t border-cream-400 px-3 py-3">
            {SECONDARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.92rem] text-clay-500 transition-colors hover:bg-cream-200"
                >
                  <item.icon className="h-[1.05rem] w-[1.05rem] text-clay-300" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-cream-400 bg-cream-200 px-6 py-4">
          <p className="font-gujarati text-sm text-terracotta-400">
            {t.footer.tagline}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-clay-300">
            <MapPin className="h-3.5 w-3.5" />
            Vadodara, Gujarat
          </p>
        </div>
      </nav>
    </div>
  );
}
