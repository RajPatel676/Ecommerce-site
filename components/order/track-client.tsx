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
import { formatDate, inr } from "@/lib/utils";
import type { Order } from "@/lib/types";

export function TrackClient() {
  const params = useSearchParams();
  const { getOrder, hydrated } = useStore();

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
          <p className="kicker mb-3">Order tracking</p>
          <h1 className="text-[1.9rem] leading-tight text-clay-600 sm:text-[2.4rem]">
            Where is my Godadi?
          </h1>
          <p className="mt-3 text-[0.95rem] text-clay-400">
            Enter the order ID from your confirmation email or the account page.
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
                placeholder="Enter your Order ID"
                aria-label="Order ID"
                className="h-[3.25rem] pl-11 font-mono"
              />
            </div>
            <Button type="submit" size="lg" loading={checking} className="shrink-0">
              Track Shipment
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
            Try the sample order{" "}
            <span className="font-mono text-clay-500">{DEMO_ORDER_ID}</span>
          </button>
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        {!submitted ? (
          <Placeholder />
        ) : !hydrated ? (
          <div className="skeleton mx-auto h-96 max-w-4xl rounded-3xl" />
        ) : !order ? (
          <NotFound id={submitted} />
        ) : (
          <Result order={order} copied={copied} setCopied={setCopied} />
        )}
      </div>
    </>
  );
}

function Result({
  order,
  copied,
  setCopied,
}: {
  order: Order;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="card-surface overflow-hidden">
        {/* header strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-400 bg-cream-200 p-5">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-clay-300">
              Order
            </p>
            <p className="mt-1 font-mono text-[1.05rem] font-semibold text-clay-600">
              #{order.id}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-[0.82rem] text-clay-300">
              Placed {formatDate(order.placedAt)}
            </span>
          </div>
        </div>

        <div className="grid gap-8 p-5 lg:grid-cols-[1.1fr_1fr] lg:p-7">
          {/* timeline */}
          <div>
            <h2 className="mb-6 font-display text-lg text-clay-600">
              Shipment progress
            </h2>
            <OrderTimeline order={order} />
          </div>

          {/* courier + items */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-cream-400 bg-cream-200 p-4">
              <h3 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                <Truck className="h-4 w-4 text-terracotta-400" />
                Courier
              </h3>
              <dl className="mt-3 space-y-2.5 text-[0.85rem]">
                <Row label="Partner" value={order.courier} />
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-clay-300">Tracking number</dt>
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
                      aria-label="Copy tracking number"
                      className="rounded p-1 text-clay-300 transition-colors hover:bg-cream-300 hover:text-clay-500"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </dd>
                </div>
                <Row
                  label="Estimated delivery"
                  value={formatDate(order.estimatedDelivery)}
                />
                <Row
                  label="Method"
                  value={
                    order.deliveryMethod === "express"
                      ? "Express (2–3 days)"
                      : "Standard (4–6 days)"
                  }
                />
              </dl>
              {copied && (
                <p className="mt-2 animate-fade-in text-[0.72rem] text-leaf-400">
                  Tracking number copied.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-cream-400 p-4">
              <h3 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                <MapPin className="h-4 w-4 text-terracotta-400" />
                Delivering to
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
                In this parcel
              </h3>
              <div className="mt-1">
                <OrderItems order={order} />
              </div>
              <p className="mt-3 flex justify-between border-t border-cream-400 pt-3 text-[0.9rem] font-semibold text-clay-600">
                <span>Order total</span>
                <span className="tabular-nums">{inr(order.total)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[0.78rem] text-clay-300">
        This is mock tracking data for a prototype. Change the status from the{" "}
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

function NotFound({ id }: { id: string }) {
  return (
    <div className="mx-auto max-w-md animate-fade-in rounded-3xl border border-dashed border-cream-500 bg-cream-200 px-6 py-14 text-center">
      <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-cream-500 bg-cream-100">
        <PackageSearch className="h-7 w-7 text-clay-200" />
      </span>
      <h2 className="font-display text-xl text-clay-600">
        No order found for “{id}”.
      </h2>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-clay-300">
        Order IDs look like GD20260906001. Check your confirmation email, or try the
        sample order above.
      </p>
      <Link
        href="/contact"
        className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-terracotta-500 hover:underline"
      >
        Ask us for help <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
      {[
        { icon: Search, t: "Enter the ID", d: "It is in your confirmation email and on the account page." },
        { icon: Truck, t: "See live status", d: "Every step from packing to your door, with timestamps." },
        { icon: Package, t: "Know when to expect it", d: "Standard takes 4–6 days, express 2–3." },
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
