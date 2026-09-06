"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, PackageSearch, Search } from "lucide-react";
import { AdminHeading, Panel, Td, Th } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/field";
import { EmptyState, PaymentBadge, StatusBadge } from "@/components/ui/misc";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";
import { cn, formatDate, inr } from "@/lib/utils";

const filtersFor = (
  t: Dict,
): { key: string; label: string; match: (s: OrderStatus) => boolean }[] => [
  { key: "all", label: t.admin.all, match: () => true },
  { key: "pending", label: t.status.pending_payment, match: (s) => s === "pending_payment" },
  {
    key: "confirmed",
    label: t.status.confirmed,
    match: (s) => s === "payment_confirmed" || s === "confirmed",
  },
  { key: "packed", label: t.status.packed, match: (s) => s === "packed" },
  {
    key: "shipped",
    label: t.status.shipped,
    match: (s) => ["shipped", "in_transit", "out_for_delivery"].includes(s),
  },
  { key: "delivered", label: t.status.delivered, match: (s) => s === "delivered" },
  { key: "cancelled", label: t.status.cancelled, match: (s) => s === "cancelled" },
];

export default function AdminOrdersPage() {
  const { orders, hydrated } = useStore();
  const t = useT();
  const FILTERS = filtersFor(t);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter)!;
    const term = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        f.match(o.status) &&
        (!term ||
          [o.id, o.customer.name, o.customer.city, o.trackingNumber]
            .join(" ")
            .toLowerCase()
            .includes(term)),
    );
  }, [orders, filter, q, FILTERS]);

  return (
    <>
      <AdminHeading
        title={t.admin.orders}
        description={t.admin.dashboardDesc}
        action={
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.admin.searchOrders}
              aria-label={t.admin.searchOrders}
              className="h-11 pl-10"
            />
          </div>
        }
      />

      {/* filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => {
          const count = orders.filter((o) => f.match(o.status)).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[0.82rem] transition-colors",
                filter === f.key
                  ? "border-terracotta-400 bg-terracotta-50 font-medium text-terracotta-500"
                  : "border-cream-500 bg-card text-clay-400 hover:border-clay-200",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[0.68rem] font-semibold",
                  filter === f.key
                    ? "bg-terracotta-500 text-on-accent"
                    : "bg-cream-300 text-clay-400",
                )}
              >
                {hydrated ? count : "–"}
              </span>
            </button>
          );
        })}
      </div>

      <Panel>
        {!hydrated ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-10 rounded" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={t.shop.emptyTitle}
            description={t.shop.emptyDesc}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[58rem] text-left text-[0.85rem]">
              <thead className="border-b border-cream-400 bg-cream-200 text-[0.72rem] uppercase tracking-[0.1em] text-clay-300">
                <tr>
                  <Th>{t.admin.orderId}</Th>
                  <Th>{t.admin.customer}</Th>
                  <Th>{t.admin.amount}</Th>
                  <Th>{t.admin.paymentCol}</Th>
                  <Th>{t.admin.shippingCol}</Th>
                  <Th>{t.admin.statusCol}</Th>
                  <Th>{t.admin.dateCol}</Th>
                  <Th>{""}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-400">
                {rows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-cream-100">
                    <Td>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-[0.8rem] font-medium text-terracotta-500 hover:underline"
                      >
                        {o.id}
                      </Link>
                    </Td>
                    <Td>
                      <span className="font-medium text-clay-600">
                        {o.customer.name}
                      </span>
                      <span className="block text-[0.75rem] text-clay-300">
                        {o.customer.city}, {o.customer.state}
                      </span>
                    </Td>
                    <Td className="font-semibold tabular-nums text-clay-600">
                      {inr(o.total)}
                    </Td>
                    <Td>
                      <PaymentBadge status={o.paymentStatus} />
                      <span className="mt-1 block text-[0.72rem] text-clay-300">
                        {t.payment[o.paymentMethod]}
                      </span>
                    </Td>
                    <Td className="text-clay-400">
                      <span className="capitalize">{o.deliveryMethod}</span>
                      <span className="block font-mono text-[0.72rem] text-clay-300">
                        {o.trackingNumber}
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge status={o.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-clay-300">
                      {formatDate(o.placedAt)}
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        aria-label={`${t.admin.view} ${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cream-500 px-3 py-1.5 text-[0.78rem] text-clay-500 transition-colors hover:border-terracotta-300 hover:text-terracotta-500"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {t.admin.view}
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
