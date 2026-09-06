"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, MapPin, Package, PackageSearch, Truck } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { OrderItems, OrderTotals } from "@/components/order/order-items";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState, PaymentBadge, StatusBadge } from "@/components/ui/misc";
import { PAYMENT_METHOD_LABEL } from "@/lib/status";
import { cn, formatDate } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const { getOrder, hydrated } = useStore();
  const order = getOrder(params.id);

  if (!hydrated) {
    return (
      <div className="container py-16">
        <div className="skeleton mx-auto h-72 max-w-2xl rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={PackageSearch}
          title="We could not find that order."
          description={`No order matches ${params.id}. Check the ID, or look it up on the tracking page.`}
          actionLabel="Track an order"
          actionHref="/track"
          className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
        />
      </div>
    );
  }

  return (
    <div className="container py-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* --------------------------------------------------------- header */}
        <div className="text-center">
          <span className="mx-auto grid h-20 w-20 animate-scale-in place-items-center rounded-full bg-leaf-100 text-leaf-500">
            <Check className="h-9 w-9" strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-[1.9rem] leading-tight text-clay-600 sm:text-[2.4rem]">
            Thank you for your order!
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[0.98rem] leading-relaxed text-clay-400">
            Your Godadi is now on its way to becoming part of your home.
          </p>
          <p className="mt-2 font-gujarati text-[0.92rem] text-terracotta-400">
            આભાર — તમારી ગોદડી ટૂંક સમયમાં તમારા ઘરે પહોંચશે.
          </p>
        </div>

        {/* ------------------------------------------------------ order meta */}
        <div className="card-surface mt-9 overflow-hidden">
          <div className="grid divide-y divide-cream-400 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <Meta label="Order ID" value={order.id} mono />
            <Meta label="Order date" value={formatDate(order.placedAt)} />
            <Meta
              label="Estimated delivery"
              value={formatDate(order.estimatedDelivery)}
            />
            <Meta
              label="Payment"
              value={PAYMENT_METHOD_LABEL[order.paymentMethod]}
              badge={<PaymentBadge status={order.paymentStatus} />}
            />
          </div>
        </div>

        {/* ------------------------------------------------------- progress */}
        <div className="card-surface mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cream-300 text-terracotta-500">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.75rem] uppercase tracking-[0.14em] text-clay-300">
                Current status
              </p>
              <div className="mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[0.82rem] text-clay-400">
            <Truck className="h-4 w-4 text-clay-300" />
            {order.courier} ·{" "}
            <span className="font-mono text-clay-500">{order.trackingNumber}</span>
          </div>
        </div>

        {/* -------------------------------------------------------- summary */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="card-surface p-5">
            <h2 className="font-display text-lg text-clay-600">Order Summary</h2>
            <div className="mt-3">
              <OrderItems order={order} />
            </div>
            <div className="mt-4 border-t border-cream-400 pt-4">
              <OrderTotals order={order} />
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-lg text-clay-600">
              <MapPin className="h-4 w-4 text-clay-300" />
              Delivering to
            </h2>
            <address className="mt-3 not-italic text-[0.88rem] leading-relaxed text-clay-400">
              <span className="block font-medium text-clay-600">
                {order.customer.name}
              </span>
              {order.customer.house}
              <br />
              {order.customer.street}
              <br />
              {order.customer.city}, {order.customer.state} {order.customer.pincode}
              <br />
              <span className="mt-2 block text-clay-300">{order.customer.phone}</span>
              <span className="block text-clay-300">{order.customer.email}</span>
            </address>
            <p className="mt-4 rounded-xl bg-cream-200 p-3 text-[0.78rem] leading-relaxed text-clay-300">
              A confirmation has been sent to {order.customer.email}. This is a
              prototype, so no email actually leaves the building.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/track?order=${order.id}`}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Track My Order
          </Link>
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
  badge,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="p-4">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-clay-300">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-[0.92rem] font-medium text-clay-600",
          mono && "font-mono text-[0.86rem]",
        )}
      >
        {value}
      </p>
      {badge && <div className="mt-2">{badge}</div>}
    </div>
  );
}
