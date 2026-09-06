"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Copy,
  MapPin,
  Package,
  PackageSearch,
  Search,
  Truck,
} from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/misc";
import { OrderItems } from "@/components/order/order-items";
import { OrderTimeline } from "@/components/order/order-timeline";
import { DEMO_ORDER_ID } from "@/lib/data/orders";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";
import { formatDate, inr } from "@/lib/utils";
import type { Order } from "@/lib/types";

export function TrackClient() {
  const params = useSearchParams();
  const { getOrder, hydrated } = useStore();
  const t = useT();

  const [query, setQuery] = useState(params.get("order") ?? "");
  const [submitted, setSubmitted] = useState<string | null>(
    params.get("order") ?? null,
  );
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const order = submitted ? getOrder(submitted) : undefined;

  useEffect(() => {
    const fromUrl = params.get("order");
    if (fromUrl) {
      setQuery(fromUrl);
      setSubmitted(fromUrl);
    }
  }, [params]);

  const lookUp = async (id: string) => {
    if (!id.trim()) return;
    setChecking(true);
    await new Promise((r) => setTimeout(r, 550)); // mock courier round-trip
    setSubmitted(id.trim());
    setChecking(false);
  };

  return (
    <>
      <section className="border-b border-cream-400 bg-cream-200 py-12 weave lg:py-16">
        <div className="container max-w-2xl text-center">
          <p className="kicker mb-3">{t.track.kicker}</p>
          <h1 className="text-[1.9rem] leading-tight text-clay-600 sm:text-[2.4rem]">
            {t.track.title}
          </h1>
          <p className="mt-3 text-[0.95rem] text-clay-400">
            {t.track.desc}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookUp(query);
            }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder={t.track.placeholder}
                aria-label={t.confirmation.orderId}
                className="h-[3.25rem] pl-11 font-mono"
              />
            </div>
            <Button type="submit" size="lg" loading={checking} className="shrink-0">
              {t.track.button}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setQuery(DEMO_ORDER_ID);
              lookUp(DEMO_ORDER_ID);
            }}
            className="mt-3.5 text-[0.8rem] text-clay-300 transition-colors hover:text-terracotta-500"
          >
            {t.track.trySample}{" "}
            <span className="font-mono text-clay-500">{DEMO_ORDER_ID}</span>
          </button>
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        {!submitted ? (
          <Placeholder t={t} />
        ) : !hydrated ? (
          <div className="skeleton mx-auto h-96 max-w-4xl rounded-3xl" />
        ) : !order ? (
          <NotFound id={submitted} t={t} />
        ) : (
          <Result order={order} copied={copied} setCopied={setCopied} t={t} />
        )}
      </div>
    </>
  );
}

function Result({
  order,
  copied,
  setCopied,
  t,
}: {
  order: Order;
  copied: boolean;
  setCopied: (v: boolean) => void;
  t: Dict;
}) {
  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="card-surface overflow-hidden">
        {/* header strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-400 bg-cream-200 p-5">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-clay-300">
              {t.track.order}
            </p>
            <p className="mt-1 font-mono text-[1.05rem] font-semibold text-clay-600">
              #{order.id}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-[0.82rem] text-clay-300">
              {t.track.placed} {formatDate(order.placedAt)}
            </span>
          </div>
        </div>

        <div className="grid gap-8 p-5 lg:grid-cols-[1.1fr_1fr] lg:p-7">
          {/* timeline */}
          <div>
            <h2 className="mb-6 font-display text-lg text-clay-600">
              {t.track.progress}
            </h2>
            <OrderTimeline order={order} />
          </div>

          {/* courier + items */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-cream-400 bg-cream-200 p-4">
              <h3 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                <Truck className="h-4 w-4 text-terracotta-400" />
                {t.track.courier}
              </h3>
              <dl className="mt-3 space-y-2.5 text-[0.85rem]">
                <Row label={t.track.partner} value={order.courier} />
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-clay-300">{t.track.trackingNumber}</dt>
                  <dd className="flex items-center gap-1.5">
                    <span className="font-mono text-clay-600">
                      {order.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(order.trackingNumber);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1800);
                      }}
                      aria-label={t.track.trackingNumber}
                      className="rounded p-1 text-clay-300 transition-colors hover:bg-cream-300 hover:text-clay-500"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </dd>
                </div>
                <Row
                  label={t.track.estimated}
                  value={formatDate(order.estimatedDelivery)}
                />
                <Row
                  label={t.track.method}
                  value={
                    order.deliveryMethod === "express"
                      ? t.track.methodExpress
                      : t.track.methodStandard
                  }
                />
              </dl>
              {copied && (
                <p className="mt-2 animate-fade-in text-[0.72rem] text-leaf-400">
                  {t.track.copied}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-cream-400 p-4">
              <h3 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                <MapPin className="h-4 w-4 text-terracotta-400" />
                {t.track.deliveringTo}
              </h3>
              <address className="mt-2.5 not-italic text-[0.85rem] leading-relaxed text-clay-400">
                <span className="font-medium text-clay-600">
                  {order.customer.name}
                </span>
                <br />
                {order.customer.house}, {order.customer.street}
                <br />
                {order.customer.city}, {order.customer.state} {order.customer.pincode}
              </address>
            </div>

            <div className="rounded-2xl border border-cream-400 p-4">
              <h3 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                <Package className="h-4 w-4 text-terracotta-400" />
                {t.track.inParcel}
              </h3>
              <div className="mt-1">
                <OrderItems order={order} />
              </div>
              <p className="mt-3 flex justify-between border-t border-cream-400 pt-3 text-[0.9rem] font-semibold text-clay-600">
                <span>{t.track.orderTotal}</span>
                <span className="tabular-nums">{inr(order.total)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[0.78rem] text-clay-300">
        {t.track.mockNote}{" "}
        <Link href={`/admin/orders/${order.id}`} className="text-terracotta-500 hover:underline">
          admin order page
        </Link>{" "}
        and refresh here to watch it move.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-clay-300">{label}</dt>
      <dd className="text-right font-medium text-clay-600">{value}</dd>
    </div>
  );
}

function NotFound({ id, t }: { id: string; t: Dict }) {
  return (
    <div className="mx-auto max-w-md animate-fade-in rounded-3xl border border-dashed border-cream-500 bg-cream-200 px-6 py-14 text-center">
      <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-cream-500 bg-cream-100">
        <PackageSearch className="h-7 w-7 text-clay-200" />
      </span>
      <h2 className="font-display text-xl text-clay-600">
        {t.track.notFound(id)}
      </h2>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-clay-300">
        {t.track.notFoundDesc}
      </p>
      <Link
        href="/contact"
        className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-terracotta-500 hover:underline"
      >
        {t.track.askHelp} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function Placeholder({ t }: { t: Dict }) {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
      {[
        { icon: Search, ...t.track.steps.enter },
        { icon: Truck, ...t.track.steps.live },
        { icon: Package, ...t.track.steps.expect },
      ].map((s) => (
        <div key={s.t} className="rounded-2xl border border-cream-400 bg-cream-200 p-5">
          <s.icon className="h-5 w-5 text-terracotta-400" />
          <p className="mt-3 font-display text-[1rem] text-clay-600">{s.t}</p>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-clay-300">{s.d}</p>
        </div>
      ))}
    </div>
  );
}
