"use client";

import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";
import { useT } from "@/components/i18n/language-provider";
import { inr } from "@/lib/utils";

export function OrderItems({ order }: { order: Order }) {
  const t = useT();
  return (
    <ul className="divide-y divide-cream-400">
      {order.items.map((it, i) => {
        const product = PRODUCTS.find((p) => p.id === it.productId);
        const inner = (
          <>
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-cream-400 bg-cream-200">
              <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.92rem] font-medium leading-snug text-clay-600">
                {it.name}
              </p>
              <p className="font-gujarati text-[0.75rem] text-clay-300">
                {it.gujaratiName}
              </p>
              <p className="mt-1 text-[0.78rem] text-clay-300">
                {t.sizes[it.size]} · {t.common.quantity} {it.qty}
              </p>
            </div>
            <p className="shrink-0 text-[0.92rem] font-semibold text-clay-600">
              {inr(it.price * it.qty)}
            </p>
          </>
        );

        return (
          <li key={`${it.productId}-${it.size}-${i}`} className="py-3.5">
            {product ? (
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center gap-3.5 transition-opacity hover:opacity-80"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex items-center gap-3.5">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function OrderTotals({ order }: { order: Order }) {
  const t = useT();
  return (
    <dl className="space-y-2.5 text-[0.88rem]">
      <div className="flex justify-between text-clay-400">
        <dt>{t.cart.subtotal}</dt>
        <dd className="tabular-nums">{inr(order.subtotal)}</dd>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between text-leaf-400">
          <dt>{t.cart.discount}{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
          <dd className="tabular-nums">−{inr(order.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between text-clay-400">
        <dt>{t.cart.shipping}</dt>
        <dd className="tabular-nums">
          {order.shipping === 0 ? (
            <span className="text-leaf-400">{t.common.free}</span>
          ) : (
            inr(order.shipping)
          )}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-cream-400 pt-3 text-lg font-semibold text-clay-600">
        <dt>{t.cart.total}</dt>
        <dd className="tabular-nums">{inr(order.total)}</dd>
      </div>
    </dl>
  );
}
