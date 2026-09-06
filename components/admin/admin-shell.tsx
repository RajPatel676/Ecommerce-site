"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { ThemePicker } from "@/components/theme/theme-picker";
import { LanguagePicker } from "@/components/i18n/language-picker";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navFor = (t: Dict) => [
  { href: "/admin", label: t.admin.dashboard, icon: LayoutDashboard, exact: true, key: "dashboard" },
  { href: "/admin/orders", label: t.admin.orders, icon: ShoppingCart, key: "orders" },
  { href: "/admin/products", label: t.admin.products, icon: Package, key: "products" },
  { href: "/admin/customers", label: t.admin.customers, icon: Users, key: "customers" },
  { href: "/admin/coupons", label: t.admin.coupons, icon: Ticket, key: "coupons" },
  { href: "/admin/settings", label: t.admin.settings, icon: Settings, key: "settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast, orders, hydrated } = useStore();
  const t = useT();
  const NAV = navFor(t);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const pending = hydrated
    ? orders.filter((o) =>
        ["pending_payment", "payment_confirmed", "confirmed"].includes(o.status),
      ).length
    : 0;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const Sidebar = (
    <div className="flex h-full flex-col bg-inverse text-on-inverse-muted">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex flex-col leading-none">
          <span className="font-gujarati text-[1.05rem] font-semibold text-on-inverse">
            હંસાબેન ગોદડી
          </span>
          <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-mustard-200">
            {t.admin.admin}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t.common.close}
          className="grid h-9 w-9 place-items-center rounded-full text-on-inverse-muted/70 hover:bg-inverse-2 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.88rem] transition-colors",
              isActive(n.href, n.exact)
                ? "bg-inverse-2 font-medium text-on-inverse"
                : "text-on-inverse-muted/70 hover:bg-inverse-2/60 hover:text-on-inverse",
            )}
          >
            <n.icon className="h-[1.05rem] w-[1.05rem]" />
            {n.label}
            {n.key === "orders" && pending > 0 && (
              <span className="ml-auto rounded-full bg-terracotta-500 px-1.5 py-0.5 text-[0.65rem] font-bold text-on-accent">
                {pending}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-clay-500 px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.85rem] text-on-inverse-muted/70 transition-colors hover:bg-inverse-2/60 hover:text-on-inverse"
        >
          <ArrowUpRight className="h-[1.05rem] w-[1.05rem]" />
          {t.admin.viewStorefront}
        </Link>
        <button
          type="button"
          onClick={() =>
            toast({
              title: t.account.signedOut,
              description: t.account.signedOutDesc,
            })
          }
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.85rem] text-on-inverse-muted/70 transition-colors hover:bg-inverse-2/60 hover:text-on-inverse"
        >
          <LogOut className="h-[1.05rem] w-[1.05rem]" />
          {t.admin.logout}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-cream-200">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 lg:block">
        {Sidebar}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-inverse/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 animate-slide-in-left">
            {Sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-cream-400 bg-cream-100/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.admin.openMenu}
            className="grid h-10 w-10 place-items-center rounded-full text-clay-500 hover:bg-cream-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-gujarati text-[1rem] font-semibold text-clay-600">
            હંસાબેન ગોદડી
          </span>
          <span className="ml-auto text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta-500">
            {t.admin.admin}
          </span>
          <LanguagePicker />
          <ThemePicker />
        </header>

        <div className="hidden items-center justify-end gap-1 border-b border-cream-400 bg-cream-100 px-4 py-2 lg:flex">
          <LanguagePicker />
          <ThemePicker />
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.6rem] leading-tight text-clay-600 sm:text-[1.9rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[0.88rem] text-clay-300">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-cream-400 bg-card shadow-soft",
        className,
      )}
    >
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-cream-400 px-5 py-3.5">
          <h2 className="font-display text-[1.05rem] text-clay-600">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-5 py-3 font-semibold">{children}</th>;
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-5 py-3.5 align-middle", className)}>{children}</td>;
}
