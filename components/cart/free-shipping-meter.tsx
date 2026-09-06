"use client";

import { Truck, Check } from "lucide-react";
import { inr } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/data/orders";

export function FreeShippingMeter({
  gap,
  subtotal,
}: {
  gap: number;
  subtotal: number;
}) {
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const done = gap <= 0 && subtotal > 0;

  return (
    <div className="rounded-2xl border border-cream-400 bg-cream-200 p-4">
      <p className="flex items-center gap-2 text-[0.82rem] text-clay-500">
        {done ? (
          <>
            <Check className="h-4 w-4 shrink-0 text-leaf-400" />
            <span>
              <strong className="font-semibold text-leaf-400">
                Free delivery unlocked.
              </strong>{" "}
              Your godadi ships on us.
            </span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4 shrink-0 text-terracotta-400" />
            <span>
              You are{" "}
              <strong className="font-semibold text-terracotta-500">
                {inr(gap)}
              </strong>{" "}
              away from free delivery.
            </span>
          </>
        )}
      </p>
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-500"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards free delivery"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-terracotta-300 to-terracotta-500 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
