"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/field";
import { EmptyState, QuantityStepper } from "@/components/ui/misc";
import { FreeShippingMeter } from "@/components/cart/free-shipping-meter";
import { ProductCard } from "@/components/product/product-card";
import { featuredProducts } from "@/lib/data/products";
import { useT } from "@/components/i18n/language-provider";
import { productName, productSubName } from "@/lib/i18n/content";
import { cn, inr } from "@/lib/utils";

export function CartPageClient() {
  const {
    hydrated,
    lines,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    setQty,
    removeLine,
    coupon,
    applyCoupon,
    removeCoupon,
    freeShippingGap,
  } = useStore();
  const t = useT();
  const [code, setCode] = useState("");

  if (!hydrated) {
    return (
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={ShoppingBag}
          title={t.cart.emptyTitle}
          gujarati={t.cart.emptyGu}
          description={t.cart.emptyDescPage}
          actionLabel={t.common.exploreGodadi}
          actionHref="/shop"
          className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
        />

        <section className="mt-16">
          <h2 className="mb-7 text-center font-display text-2xl text-clay-600">
            {t.cart.startFavourite}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 lg:gap-x-6">
            {featuredProducts()
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.9rem] leading-tight text-clay-600 sm:text-[2.3rem]">
            {t.cart.title}
          </h1>
          <p className="mt-1.5 text-[0.9rem] text-clay-300">
            {t.cart.ready(cartCount)}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-terracotta-500 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.continueShopping}
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
        {/* lines */}
        <div>
          <FreeShippingMeter gap={freeShippingGap} subtotal={subtotal} />

          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li
                key={l.key}
                className="card-surface flex gap-4 p-3.5 transition-shadow hover:shadow-lift sm:p-4"
              >
                <Link
                  href={`/product/${l.product.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-cream-400 bg-cream-200 sm:h-36 sm:w-32"
                >
                  <Image
                    src={l.image}
                    alt={l.product.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${l.product.slug}`}
                        className="font-display text-[1.02rem] leading-snug text-clay-600 hover:text-terracotta-500"
                      >
                        {productName(l.product, t)}
                      </Link>
                      <p className="mt-0.5 text-[0.78rem] text-clay-300">
                        {productSubName(l.product, t)}
                      </p>
                      <p className="mt-1.5 text-[0.8rem] text-clay-300">
                        {t.common.size}{" "}
                        <span className="text-clay-500">{t.sizes[l.size]}</span> ·{" "}
                        {t.common.pattern}{" "}
                        <span className="text-clay-500">{l.variantLabel}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(l.key)}
                      aria-label={`${t.common.remove} ${l.product.name}`}
                      className="shrink-0 rounded-full p-2 text-clay-200 transition-colors hover:bg-rose-50 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      qty={l.qty}
                      size="sm"
                      onChange={(n) => setQty(l.key, n)}
                    />
                    <div className="text-right">
                      <p className="text-[1.05rem] font-semibold text-clay-600">
                        {inr(l.lineTotal)}
                      </p>
                      {l.unitMrp > l.unitPrice && (
                        <p className="text-[0.75rem] text-clay-300 line-through">
                          {inr(l.unitMrp * l.qty)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="card-surface p-5">
            <h2 className="font-display text-xl text-clay-600">{t.cart.summary}</h2>

            {/* coupon */}
            <div className="mt-5">
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-leaf-200 bg-leaf-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-[0.82rem] text-leaf-500">
                    <Tag className="h-4 w-4" />
                    <span className="font-semibold">{coupon.code}</span>
                    <span className="text-leaf-400">{t.cart.couponApplied}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label={t.common.remove}
                    className="rounded-full p-1 text-leaf-400 hover:bg-leaf-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (applyCoupon(code)) setCode("");
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder={t.cart.couponPlaceholder}
                    aria-label={t.cart.couponPlaceholder}
                    className="h-11"
                  />
                  <Button type="submit" variant="subtle" className="shrink-0">
                    {t.common.apply}
                  </Button>
                </form>
              )}
              {!coupon && (
                <p className="mt-2 text-[0.72rem] text-clay-300">
                  {t.cart.couponHint}{" "}
                  <span className="font-semibold text-clay-400">GODADI10</span> ·{" "}
                  <span className="font-semibold text-clay-400">WARMTH250</span>
                </p>
              )}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-cream-400 pt-5 text-[0.88rem]">
              <div className="flex justify-between text-clay-400">
                <dt>{t.cart.subtotal}</dt>
                <dd className="tabular-nums">{inr(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-leaf-400">
                <dt>{t.cart.discount}</dt>
                <dd className="tabular-nums">
                  {discount > 0 ? `−${inr(discount)}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between text-clay-400">
                <dt>{t.cart.shipping}</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-leaf-400">{t.common.free}</span>
                  ) : (
                    inr(shipping)
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-cream-400 pt-3.5 text-lg font-semibold text-clay-600">
                <dt>{t.cart.total}</dt>
                <dd className="tabular-nums">{inr(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className={cn(buttonVariants({ size: "lg", full: true }), "mt-5")}
            >
              {t.cart.checkout}
            </Link>

            <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-clay-300">
              {t.cart.prototypeNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
