"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, Star } from "lucide-react";
import { cn, inr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge, ProductBadge } from "@/components/ui/badge";
import { STATUS_TONE, PAYMENT_TONE } from "@/lib/status";
import { useT } from "@/components/i18n/language-provider";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

/* ------------------------------------------------------------------ stars */

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn(
              px,
              i < Math.round(value)
                ? "fill-mustard-300 text-mustard-300"
                : "text-cream-500",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "font-medium text-clay-400",
          size === "md" ? "text-sm" : "text-[0.75rem]",
        )}
      >
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            "text-clay-300",
            size === "md" ? "text-sm" : "text-[0.75rem]",
          )}
        >
          ({count})
        </span>
      )}
      <span className="sr-only">
        Rated {value} out of 5{count !== undefined ? ` from ${count} reviews` : ""}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ price */

export function Price({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const s = {
    sm: ["text-sm", "text-[0.72rem]", "text-[0.65rem]"],
    md: ["text-[1.05rem]", "text-[0.8rem]", "text-[0.68rem]"],
    lg: ["text-2xl", "text-base", "text-[0.72rem]"],
  }[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-semibold text-clay-600", s[0])}>{inr(price)}</span>
      {off > 0 && (
        <>
          <span className={cn("text-clay-300 line-through", s[1])}>{inr(mrp!)}</span>
          <span
            className={cn(
              "rounded-full bg-leaf-50 px-1.5 py-0.5 font-semibold text-leaf-400",
              s[2],
            )}
          >
            {off}% off
          </span>
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- quantity */

export function QuantityStepper({
  qty,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "Quantity",
}: {
  qty: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div
      className="inline-flex items-center rounded-full border border-cream-500 bg-card"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label="Decrease quantity"
        className={cn(
          btn,
          "grid place-items-center rounded-full text-clay-400 transition-colors hover:bg-cream-200 disabled:opacity-35 disabled:hover:bg-transparent",
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "min-w-[2ch] text-center font-semibold tabular-nums text-clay-600",
          size === "sm" ? "text-sm" : "text-[0.95rem]",
        )}
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        aria-label="Increase quantity"
        className={cn(
          btn,
          "grid place-items-center rounded-full text-clay-400 transition-colors hover:bg-cream-200 disabled:opacity-35 disabled:hover:bg-transparent",
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- statuses */

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        STATUS_TONE[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {t.status[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        PAYMENT_TONE[status],
      )}
    >
      {t.payment[status]}
    </span>
  );
}

/* ------------------------------------------------------------ empty state */

export function EmptyState({
  icon: Icon,
  title,
  gujarati,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  gujarati?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-full border border-dashed border-cream-500 bg-cream-200">
        <Icon className="h-8 w-8 text-clay-200" />
      </div>
      <h3 className="font-display text-xl text-clay-600">{title}</h3>
      {gujarati && (
        <p className="mt-1.5 font-gujarati text-sm text-clay-300">{gujarati}</p>
      )}
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-clay-300">
          {description}
        </p>
      )}
      {actionLabel &&
        (actionHref ? (
          <Link
            href={actionHref}
            onClick={onAction}
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-6")}
          >
            {actionLabel}
          </Link>
        ) : (
          <Button className="mt-6" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}

/* --------------------------------------------------------------- skeleton */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

/* ------------------------------------------------------------ section head */

export function SectionHeading({
  kicker,
  title,
  gujarati,
  description,
  align = "center",
  action,
}: {
  kicker?: string;
  title: string;
  gujarati?: string;
  description?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {kicker && <p className="kicker mb-2.5">{kicker}</p>}
        <h2 className="text-[1.75rem] leading-tight text-clay-600 sm:text-[2.15rem]">
          {title}
        </h2>
        {gujarati && (
          <p className="mt-2 font-gujarati text-base text-terracotta-400">
            {gujarati}
          </p>
        )}
        {description && (
          <p className="mt-3 text-[0.95rem] leading-relaxed text-clay-300">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export { Badge, ProductBadge };
