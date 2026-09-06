"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState, QuantityStepper } from "@/components/ui/misc";
import { FreeShippingMeter } from "@/components/cart/free-shipping-meter";
import { cn, inr } from "@/lib/utils";

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    lines,
    subtotal,
    discount,
    shipping,
    total,
    setQty,
    removeLine,
    freeShippingGap,
    cartCount,
  } = useStore();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-inverse/40 backdrop-blur-[2px]"
        onClick={() => setCartOpen(false)}
      />

      <aside
        className={cn(
          "absolute flex flex-col bg-cream-100 shadow-drawer",
          // full-screen sheet on mobile, side drawer from md up
          "inset-x-0 bottom-0 top-14 animate-slide-up rounded-t-3xl",
          "sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[27rem] sm:animate-slide-in-right sm:rounded-none",
        )}
      >
        <header className="flex items-center justify-between border-b border-cream-400 px-5 py-4">
          <div>
            <h2 className="font-display text-xl text-clay-600">Your Cart</h2>
            <p className="text-[0.75rem] text-clay-300">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-clay-400 transition-colors hover:bg-cream-300"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is waiting for a little warmth."
              gujarati="તમારી ગાડી હજી ખાલી છે."
              description="Nothing here yet. Our godadis are handmade in small batches — have a look."
              actionLabel="Explore Godadi"
              actionHref="/shop"
              onAction={() => setCartOpen(false)}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <FreeShippingMeter gap={freeShippingGap} subtotal={subtotal} />

              <ul className="mt-4 divide-y divide-cream-400">
                {lines.map((l) => (
                  <li key={l.key} className="flex gap-3.5 py-4">
                    <Link
                      href={`/product/${l.product.slug}`}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-cream-400 bg-cream-200"
                    >
                      <Image
                        src={l.image}
                        alt={l.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${l.product.slug}`}
                          className="font-display text-[0.95rem] leading-snug text-clay-600 hover:text-terracotta-500"
                        >
                          {l.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeLine(l.key)}
                          aria-label={`Remove ${l.product.name} from cart`}
                          className="shrink-0 rounded-full p-1.5 text-clay-200 transition-colors hover:bg-rose-50 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[0.75rem] text-clay-300">
                        {l.sizeLabel} · {l.variantLabel}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <QuantityStepper
                          qty={l.qty}
                          size="sm"
                          onChange={(n) => setQty(l.key, n)}
                        />
                        <span className="text-[0.95rem] font-semibold text-clay-600">
                          {inr(l.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-cream-400 bg-cream-200 px-5 py-4">
              <dl className="space-y-1.5 text-[0.85rem]">
                <div className="flex justify-between text-clay-400">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{inr(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-leaf-400">
                    <dt>Discount</dt>
                    <dd className="tabular-nums">−{inr(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-clay-400">
                  <dt>Shipping</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Free" : inr(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-cream-500 pt-2.5 text-base font-semibold text-clay-600">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{inr(total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className={cn(buttonVariants({ size: "lg", full: true }), "mt-4")}
              >
                Proceed to Checkout
              </Link>
              <Button
                variant="ghost"
                size="sm"
                full
                className="mt-1.5"
                onClick={() => setCartOpen(false)}
              >
                Continue shopping
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
