"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  User,
} from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState, Price, StatusBadge } from "@/components/ui/misc";
import { CURRENT_CUSTOMER, SAVED_ADDRESSES } from "@/lib/data/customers";
import { PRODUCTS } from "@/lib/data/products";
import { useT } from "@/components/i18n/language-provider";
import { productName } from "@/lib/i18n/content";
import type { Dict } from "@/lib/i18n";
import { cn, formatDate, inr } from "@/lib/utils";

const TAB_KEYS = ["profile", "orders", "addresses", "wishlist"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const tabs = (t: Dict) => [
  { key: "profile" as const, label: t.account.profile, icon: User },
  { key: "orders" as const, label: t.account.myOrders, icon: Package },
  { key: "addresses" as const, label: t.account.addresses, icon: MapPin },
  { key: "wishlist" as const, label: t.account.wishlist, icon: Heart },
];

export default function AccountPage() {
  const { myOrders, wishlist, toggleWish, hydrated, toast } = useStore();
  const t = useT();
  const TABS = tabs(t);
  const [tab, setTab] = useState<TabKey>("orders");
  const saved = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container py-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-terracotta-500 font-display text-xl text-on-accent">
          {CURRENT_CUSTOMER.name.charAt(0)}
        </span>
        <div>
          <h1 className="text-[1.6rem] leading-tight text-clay-600 sm:text-[2rem]">
            {t.account.greeting(CURRENT_CUSTOMER.name.split(" ")[0])}
          </h1>
          <p className="text-[0.85rem] text-clay-300">
            {CURRENT_CUSTOMER.email} · {t.account.memberSince}{" "}
            {formatDate(CURRENT_CUSTOMER.joinedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        {/* nav */}
        <aside>
          <nav
            aria-label={t.account.profile}
            className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-1"
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-[0.88rem] transition-colors",
                  tab === t.key
                    ? "bg-terracotta-50 font-medium text-terracotta-500"
                    : "text-clay-400 hover:bg-cream-200",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.key === "orders" && hydrated && myOrders.length > 0 && (
                  <span className="ml-auto rounded-full bg-cream-300 px-1.5 text-[0.68rem] font-semibold text-clay-400">
                    {myOrders.length}
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                toast({
                  title: t.account.signedOut,
                  description: t.account.signedOutDesc,
                })
              }
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-[0.88rem] text-clay-400 transition-colors hover:bg-cream-200 lg:mt-3 lg:border-t lg:border-cream-400 lg:pt-4"
            >
              <LogOut className="h-4 w-4" />
              {t.account.logout}
            </button>
          </nav>
        </aside>

        {/* panels */}
        <div>
          {tab === "profile" && (
            <section className="card-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-xl text-clay-600">{t.account.profile}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({ title: t.account.editDisabled })
                  }
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t.common.edit}
                </Button>
              </div>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                {[
                  [t.account.fullName, CURRENT_CUSTOMER.name],
                  [t.account.email, CURRENT_CUSTOMER.email],
                  [t.account.mobile, CURRENT_CUSTOMER.phone],
                  [t.account.city, `${CURRENT_CUSTOMER.city}, ${CURRENT_CUSTOMER.state}`],
                  [t.account.ordersPlaced, String(CURRENT_CUSTOMER.orders)],
                  [t.account.lifetimeValue, inr(CURRENT_CUSTOMER.spent)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-clay-300">
                      {k}
                    </dt>
                    <dd className="mt-1 text-[0.95rem] font-medium text-clay-600">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {tab === "orders" &&
            (!hydrated ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="skeleton h-36 rounded-2xl" />
                ))}
              </div>
            ) : myOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title={t.account.emptyOrders}
                gujarati={t.account.emptyOrdersGu}
                description={t.account.emptyOrdersDesc}
                actionLabel={t.common.exploreGodadi}
                actionHref="/shop"
                className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
              />
            ) : (
              <ul className="space-y-4">
                {myOrders.map((o) => (
                  <li key={o.id} className="card-surface overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-400 bg-cream-200 px-4 py-3">
                      <div>
                        <p className="font-mono text-[0.85rem] font-semibold text-clay-600">
                          #{o.id}
                        </p>
                        <p className="text-[0.75rem] text-clay-300">
                          {t.account.placedOn} {formatDate(o.placedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[0.95rem] font-semibold text-clay-600">
                          {inr(o.total)}
                        </span>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 p-4">
                      <div className="flex -space-x-3">
                        {o.items.slice(0, 3).map((it, i) => (
                          <div
                            key={i}
                            className="relative h-14 w-12 overflow-hidden rounded-lg border-2 border-card bg-cream-200"
                          >
                            <Image
                              src={it.image}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-[0.85rem] text-clay-400">
                        {o.items.map((i) => i.name).join(", ")}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/order-confirmation/${o.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          {t.account.viewOrder}
                        </Link>
                        <Link
                          href={`/track?order=${o.id}`}
                          className={cn(buttonVariants({ size: "sm" }))}
                        >
                          {t.account.trackOrder}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "addresses" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-clay-600">
                  {t.account.addresses}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({ title: t.account.addDisabled })
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.account.addAddress}
                </Button>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {SAVED_ADDRESSES.map((a) => (
                  <li key={a.id} className="card-surface p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cream-300 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-clay-400">
                        {a.label}
                      </span>
                      {a.isDefault && (
                        <span className="text-[0.7rem] font-medium text-leaf-400">
                          {t.account.default}
                        </span>
                      )}
                    </div>
                    <address className="mt-3 not-italic text-[0.88rem] leading-relaxed text-clay-400">
                      <span className="block font-medium text-clay-600">{a.name}</span>
                      {a.line}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                      <br />
                      <span className="text-clay-300">{a.phone}</span>
                    </address>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "wishlist" &&
            (saved.length === 0 ? (
              <EmptyState
                icon={Heart}
                title={t.wishlist.emptyTitle}
                description={t.wishlist.emptyDesc}
                actionLabel={t.common.exploreGodadi}
                actionHref="/shop"
                className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
              />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {saved.map((p) => (
                  <li key={p.id} className="card-surface flex gap-4 p-4">
                    <Link
                      href={`/product/${p.slug}`}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-cream-400"
                    >
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${p.slug}`}
                        className="font-display text-[0.98rem] text-clay-600 hover:text-terracotta-500"
                      >
                        {productName(p, t)}
                      </Link>
                      <div className="mt-1.5">
                        <Price price={p.price} mrp={p.mrp} size="sm" />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWish(p.id)}
                        className="mt-2 text-[0.78rem] text-clay-300 hover:text-rose-300"
                      >
                        {t.common.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
}
