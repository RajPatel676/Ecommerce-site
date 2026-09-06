"use client";

import { useState } from "react";
import { Copy, Plus, Ticket } from "lucide-react";
import { AdminHeading, Panel, Td, Th } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { useStore } from "@/components/store/store-provider";
import { COUPONS } from "@/lib/data/customers";
import type { Coupon } from "@/lib/types";
import { formatDate, inr } from "@/lib/utils";

export default function AdminCouponsPage() {
  const { toast } = useStore();
  const [rows, setRows] = useState<Coupon[]>(COUPONS);

  const toggle = (code: string) => {
    setRows((cur) =>
      cur.map((c) => (c.code === code ? { ...c, active: !c.active } : c)),
    );
    toast({ title: `${code} updated`, tone: "success" });
  };

  return (
    <>
      <AdminHeading
        title="Coupons"
        description="Discount codes customers can apply at checkout."
        action={
          <Button
            onClick={() =>
              toast({ title: "Creating coupons is disabled in this prototype." })
            }
          >
            <Plus className="h-4 w-4" />
            New Coupon
          </Button>
        }
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-[0.85rem]">
            <thead className="border-b border-cream-400 bg-cream-200 text-[0.72rem] uppercase tracking-[0.1em] text-clay-300">
              <tr>
                <Th>Code</Th>
                <Th>Description</Th>
                <Th>Discount</Th>
                <Th>Min. order</Th>
                <Th>Uses</Th>
                <Th>Expires</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-400">
              {rows.map((c) => (
                <tr key={c.code} className="transition-colors hover:bg-cream-100">
                  <Td>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(c.code);
                        toast({ title: `${c.code} copied` });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-cream-200 px-2.5 py-1.5 font-mono text-[0.8rem] font-semibold text-clay-600 transition-colors hover:bg-cream-300"
                    >
                      <Ticket className="h-3.5 w-3.5 text-terracotta-400" />
                      {c.code}
                      <Copy className="h-3 w-3 text-clay-300" />
                    </button>
                  </Td>
                  <Td className="text-clay-400">{c.description}</Td>
                  <Td className="font-semibold text-clay-600">
                    {c.type === "percent" ? `${c.value}%` : inr(c.value)}
                  </Td>
                  <Td className="tabular-nums text-clay-400">{inr(c.minOrder)}</Td>
                  <Td className="tabular-nums text-clay-400">{c.uses}</Td>
                  <Td className="whitespace-nowrap text-clay-300">
                    {formatDate(c.expiresAt)}
                  </Td>
                  <Td>
                    <button type="button" onClick={() => toggle(c.code)}>
                      <Badge variant={c.active ? "leaf" : "default"}>
                        {c.active ? "Active" : "Inactive"}
                      </Badge>
                    </button>
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
