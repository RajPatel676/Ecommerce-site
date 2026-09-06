"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminHeading, Panel, Td, Th } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { CUSTOMERS } from "@/lib/data/customers";
import { formatDate, inr } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

export default function AdminCustomersPage() {
  const t = useT();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return CUSTOMERS.filter(
      (c) =>
        !term ||
        [c.name, c.email, c.phone, c.city, c.id].join(" ").toLowerCase().includes(term),
    );
  }, [q]);

  const totalSpent = CUSTOMERS.reduce((s, c) => s + c.spent, 0);

  return (
    <>
      <AdminHeading
        title={t.admin.customers}
        description={`${CUSTOMERS.length} customers · ${inr(totalSpent)} lifetime value`}
        action={
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.admin.searchCustomers}
              aria-label={t.admin.searchCustomers}
              className="h-11 pl-10"
            />
          </div>
        }
      />

      <Panel>
        {rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No customers match that search."
            description="Try a name, city or email."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-[0.85rem]">
              <thead className="border-b border-cream-400 bg-cream-200 text-[0.72rem] uppercase tracking-[0.1em] text-clay-300">
                <tr>
                  <Th>{t.admin.customer}</Th>
                  <Th>Contact</Th>
                  <Th>Location</Th>
                  <Th>{t.admin.orders}</Th>
                  <Th>Lifetime value</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-400">
                {rows.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-cream-100">
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-300 font-display text-[0.9rem] text-clay-500">
                          {c.name.charAt(0)}
                        </span>
                        <div>
                          <p className="font-medium text-clay-600">{c.name}</p>
                          <p className="font-mono text-[0.7rem] text-clay-200">{c.id}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-clay-400">
                      {c.email}
                      <span className="block text-[0.75rem] text-clay-300">
                        {c.phone}
                      </span>
                    </Td>
                    <Td className="text-clay-400">
                      {c.city}
                      <span className="block text-[0.75rem] text-clay-300">
                        {c.state}
                      </span>
                    </Td>
                    <Td className="font-semibold tabular-nums text-clay-600">
                      {c.orders}
                    </Td>
                    <Td className="font-semibold tabular-nums text-clay-600">
                      {inr(c.spent)}
                    </Td>
                    <Td className="whitespace-nowrap text-clay-300">
                      {formatDate(c.joinedAt)}
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
