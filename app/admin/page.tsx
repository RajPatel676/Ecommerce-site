"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { AdminHeading, Panel, Td, Th } from "@/components/admin/admin-shell";
import { PaymentBadge, StatusBadge } from "@/components/ui/misc";
import { useStore } from "@/components/store/store-provider";
import { CUSTOMERS } from "@/lib/data/customers";
import { useT } from "@/components/i18n/language-provider";
import { cn, formatDate, inr, seeded } from "@/lib/utils";

/** Deterministic 7-day sales series so server and client agree. */
const SALES_7D = (() => {
  const rnd = seeded(2026906);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, i) => ({
    label,
    value: Math.round(9800 + rnd() * 16500 + (i === 5 ? 7200 : 0)),
    orders: Math.round(4 + rnd() * 9),
  }));
})();

export default function AdminDashboard() {
  const { orders, hydrated } = useStore();
  const t = useT();

  const stats = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    const revenue = live.reduce((s, o) => s + o.total, 0) + 92_000; // + historical archive
    const pending = orders.filter((o) =>
      ["pending_payment", "payment_confirmed", "confirmed"].includes(o.status),
    ).length;
    return {
      revenue,
      orders: orders.length + 106,
      customers: CUSTOMERS.length + 118,
      pending: pending + 16, // + the archive not modelled here
    };
  }, [orders]);

  const statusCounts = useMemo(() => {
    const keys = ["pending_payment", "confirmed", "packed", "shipped", "delivered"] as const;
    return keys.map((k) => ({
      key: k,
      label: t.status[k],
      count: orders.filter((o) =>
        k === "confirmed"
          ? ["payment_confirmed", "confirmed"].includes(o.status)
          : k === "shipped"
            ? ["shipped", "in_transit", "out_for_delivery"].includes(o.status)
            : o.status === k,
      ).length,
    }));
  }, [orders, t]);

  const maxSales = Math.max(...SALES_7D.map((d) => d.value));
  const weekTotal = SALES_7D.reduce((s, d) => s + d.value, 0);
  const recent = orders.slice(0, 6);

  return (
    <>
      <AdminHeading
        title={t.admin.dashboard}
        description={t.admin.dashboardDesc}
      />

      {/* ---------------------------------------------------------- stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={ShoppingCart}
          label={t.admin.totalOrders}
          value={hydrated ? String(stats.orders) : "—"}
          delta="+12.4%"
          tone="leaf"
        />
        <Stat
          icon={IndianRupee}
          label={t.admin.revenue}
          value={hydrated ? inr(stats.revenue) : "—"}
          delta="+8.1%"
          tone="terracotta"
        />
        <Stat
          icon={Users}
          label={t.admin.customers}
          value={hydrated ? String(stats.customers) : "—"}
          delta="+5.7%"
          tone="mustard"
        />
        <Stat
          icon={Package}
          label={t.admin.pendingOrders}
          value={hydrated ? String(stats.pending) : "—"}
          delta={t.admin.needsAction}
          tone="clay"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* ------------------------------------------------------- chart */}
        <Panel
          title={t.admin.salesOverview}
          action={
            <span className="text-[0.78rem] text-clay-300">
              {t.admin.last7} ·{" "}
              <span className="font-semibold text-clay-500">{inr(weekTotal)}</span>
            </span>
          }
          bodyClassName="p-5"
        >
          <div className="flex h-56 items-end gap-2 sm:gap-3">
            {SALES_7D.map((d) => (
              <div
                key={d.label}
                className="group flex h-full flex-1 flex-col items-center gap-2"
              >
                <span className="text-[0.68rem] font-medium tabular-nums text-clay-300 opacity-0 transition-opacity group-hover:opacity-100">
                  {inr(d.value)}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-terracotta-300 to-terracotta-500 transition-all duration-500 group-hover:from-terracotta-400 group-hover:to-terracotta-600"
                    style={{ height: `${Math.round((d.value / maxSales) * 100)}%` }}
                    role="img"
                    aria-label={`${d.label}: ${inr(d.value)} from ${d.orders} orders`}
                  />
                </div>
                <span className="text-[0.72rem] text-clay-300">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 border-t border-cream-400 pt-3.5 text-[0.78rem] text-clay-300">
            <TrendingUp className="h-3.5 w-3.5 text-leaf-400" />

          </p>
        </Panel>

        {/* ------------------------------------------ order status overview */}
        <Panel title={t.admin.statusOverview} bodyClassName="p-5">
          <ul className="space-y-4">
            {statusCounts.map((s) => {
              const total = Math.max(1, orders.length);
              const pct = Math.round((s.count / total) * 100);
              return (
                <li key={s.key}>
                  <div className="mb-1.5 flex items-baseline justify-between text-[0.82rem]">
                    <span className="text-clay-400">{s.label}</span>
                    <span className="font-semibold tabular-nums text-clay-600">
                      {hydrated ? s.count : "—"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cream-300">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-700",
                        {
                          pending_payment: "bg-mustard-300",
                          confirmed: "bg-leaf-300",
                          packed: "bg-clay-300",
                          shipped: "bg-terracotta-300",
                          delivered: "bg-leaf-400",
                        }[s.key],
                      )}
                      style={{ width: `${hydrated ? pct : 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="/admin/orders"
            className="mt-6 flex items-center justify-between rounded-xl bg-cream-200 px-4 py-3 text-[0.82rem] font-medium text-clay-500 transition-colors hover:bg-cream-300"
          >
            {t.admin.manageOrders}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </div>

      {/* -------------------------------------------------- recent orders */}
      <Panel
        className="mt-5"
        title={t.admin.recentOrders}
        action={
          <Link
            href="/admin/orders"
            className="text-[0.8rem] font-medium text-terracotta-500 hover:underline"
          >
            {t.admin.viewAll}
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[54rem] text-left text-[0.85rem]">
            <thead className="border-b border-cream-400 bg-cream-200 text-[0.72rem] uppercase tracking-[0.1em] text-clay-300">
              <tr>
                <Th>{t.admin.orderId}</Th>
                <Th>{t.admin.customer}</Th>
                <Th>{t.admin.product}</Th>
                <Th>{t.admin.amount}</Th>
                <Th>{t.admin.paymentCol}</Th>
                <Th>{t.admin.statusCol}</Th>
                <Th>{t.admin.dateCol}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-400">
              {!hydrated
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-5 py-3">
                        <div className="skeleton h-6 rounded" />
                      </td>
                    </tr>
                  ))
                : recent.map((o) => (
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
                          {o.customer.city}
                        </span>
                      </Td>
                      <Td>
                        <span className="line-clamp-1 text-clay-400">
                          {o.items[0].name}
                          {o.items.length > 1 && ` +${o.items.length - 1}`}
                        </span>
                      </Td>
                      <Td className="font-semibold tabular-nums text-clay-600">
                        {inr(o.total)}
                      </Td>
                      <Td>
                        <PaymentBadge status={o.paymentStatus} />
                      </Td>
                      <Td>
                        <StatusBadge status={o.status} />
                      </Td>
                      <Td className="whitespace-nowrap text-clay-300">
                        {formatDate(o.placedAt)}
                      </Td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  tone: "leaf" | "terracotta" | "mustard" | "clay";
}) {
  const tones = {
    leaf: "bg-leaf-50 text-leaf-400",
    terracotta: "bg-terracotta-50 text-terracotta-500",
    mustard: "bg-mustard-50 text-mustard-400",
    clay: "bg-cream-300 text-clay-400",
  };
  return (
    <div className="rounded-2xl border border-cream-400 bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-[1.1rem] w-[1.1rem]" />
        </span>
        <span className="text-[0.72rem] font-medium text-clay-300">{delta}</span>
      </div>
      <p className="mt-4 text-[0.75rem] uppercase tracking-[0.12em] text-clay-300">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl tabular-nums text-clay-600">{value}</p>
    </div>
  );
}
