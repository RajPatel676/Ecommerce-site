"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  MapPin,
  PackageSearch,
  Truck,
  User,
} from "lucide-react";
import { AdminHeading, Panel } from "@/components/admin/admin-shell";
import { OrderItems, OrderTotals } from "@/components/order/order-items";
import { OrderTimeline } from "@/components/order/order-timeline";
import { EmptyState, PaymentBadge, StatusBadge } from "@/components/ui/misc";
import { Select } from "@/components/ui/field";
import { useStore } from "@/components/store/store-provider";
import { PAYMENT_METHOD_LABEL, STATUS_LABEL } from "@/lib/status";
import { TRACKING_FLOW, type OrderStatus } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

const EDITABLE: OrderStatus[] = [...TRACKING_FLOW, "cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { getOrder, setOrderStatus, hydrated } = useStore();
  const order = getOrder(params.id);

  if (!hydrated) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  if (!order) {
    return (
      <Panel>
        <EmptyState
          icon={PackageSearch}
          title="Order not found."
          description={`No order matches ${params.id}.`}
          actionLabel="Back to orders"
          actionHref="/admin/orders"
        />
      </Panel>
    );
  }

  return (
    <>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-2 text-[0.82rem] text-clay-300 transition-colors hover:text-terracotta-500"
      >
        <ArrowLeft className="h-4 w-4" />
        All orders
      </Link>

      <AdminHeading
        title={`Order #${order.id}`}
        description={`Placed ${formatDateTime(order.placedAt)} · ${order.items.length} ${order.items.length === 1 ? "item" : "items"}`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={order.status} />
            <Link
              href={`/track?order=${order.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-500 bg-card px-3.5 py-2 text-[0.8rem] text-clay-500 transition-colors hover:border-terracotta-300 hover:text-terracotta-500"
            >
              Customer view
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />

      {/* status control */}
      <Panel className="mb-5" bodyClassName="p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[15rem] flex-1">
            <label
              htmlFor="status"
              className="mb-1.5 block text-[0.78rem] font-medium text-clay-400"
            >
              Update order status
            </label>
            <Select
              id="status"
              value={order.status}
              onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}
            >
              {EDITABLE.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </Select>
          </div>
          <p className="flex-1 text-[0.8rem] leading-relaxed text-clay-300">
            Changing this writes to the shared prototype state — the customer&apos;s{" "}
            <Link href={`/track?order=${order.id}`} className="text-terracotta-500 hover:underline">
              tracking page
            </Link>{" "}
            updates immediately.
          </p>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <Panel title="Products" bodyClassName="px-5 pb-5">
            <OrderItems order={order} />
            <div className="mt-4 border-t border-cream-400 pt-4">
              <OrderTotals order={order} />
            </div>
          </Panel>

          <Panel title="Order Timeline" bodyClassName="p-5">
            <OrderTimeline order={order} />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Customer" bodyClassName="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-terracotta-50 font-display text-lg text-terracotta-500">
                {order.customer.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-clay-600">{order.customer.name}</p>
                <p className="truncate text-[0.8rem] text-clay-300">
                  {order.customer.email}
                </p>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 border-t border-cream-400 pt-4 text-[0.85rem]">
              <Row icon={User} label="Customer ID" value={order.customerId} />
              <Row icon={User} label="Phone" value={order.customer.phone} />
            </dl>
          </Panel>

          <Panel title="Delivery Address" bodyClassName="p-5">
            <address className="flex gap-3 not-italic text-[0.87rem] leading-relaxed text-clay-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay-200" />
              <span>
                <span className="block font-medium text-clay-600">
                  {order.customer.name}
                </span>
                {order.customer.house}
                <br />
                {order.customer.street}
                <br />
                {order.customer.city}, {order.customer.state}
                <br />
                {order.customer.pincode}
              </span>
            </address>
          </Panel>

          <Panel title="Payment" bodyClassName="p-5">
            <dl className="space-y-2.5 text-[0.85rem]">
              <Row
                icon={CreditCard}
                label="Method"
                value={PAYMENT_METHOD_LABEL[order.paymentMethod]}
              />
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-clay-300">
                  <CreditCard className="h-3.5 w-3.5" />
                  Status
                </dt>
                <dd>
                  <PaymentBadge status={order.paymentStatus} />
                </dd>
              </div>
              {order.couponCode && (
                <Row icon={CreditCard} label="Coupon" value={order.couponCode} />
              )}
            </dl>
          </Panel>

          <Panel title="Shipping" bodyClassName="p-5">
            <dl className="space-y-2.5 text-[0.85rem]">
              <Row icon={Truck} label="Courier" value={order.courier} />
              <Row
                icon={Truck}
                label="Tracking number"
                value={order.trackingNumber}
                mono
              />
              <Row
                icon={Truck}
                label="Method"
                value={order.deliveryMethod === "express" ? "Express" : "Standard"}
              />
              <Row
                icon={Truck}
                label="Estimated delivery"
                value={formatDate(order.estimatedDelivery)}
              />
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-clay-300">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd
        className={
          mono
            ? "font-mono text-[0.8rem] font-medium text-clay-600"
            : "text-right font-medium text-clay-600"
        }
      >
        {value}
      </dd>
    </div>
  );
}
