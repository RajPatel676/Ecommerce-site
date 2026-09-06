"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { AdminHeading, Panel } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";

export default function AdminSettingsPage() {
  const { toast } = useStore();
  const t = useT();
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast({
      title: "Settings saved",
      description: "Prototype only — nothing was written to a server.",
      tone: "success",
    });
  };

  const resetPrototype = () => {
    ["vg.cart.v1", "vg.wishlist.v1", "vg.orders.v1", "vg.coupon.v1", "vg.searches.v1"].forEach(
      (k) => window.localStorage.removeItem(k),
    );
    toast({ title: "Prototype data cleared", description: "Reloading…" });
    window.setTimeout(() => window.location.reload(), 700);
  };

  return (
    <>
      <AdminHeading
        title={t.admin.settings}
        description="Store details, delivery rules and prototype controls."
      />

      <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
        <Panel title="Store details" bodyClassName="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Store name" htmlFor="s-name" className="sm:col-span-2">
            <Input id="s-name" defaultValue="Hansaben Godadi" />
          </Field>
          <Field label="Gujarati name" htmlFor="s-guj" className="sm:col-span-2">
            <Input id="s-guj" defaultValue="હંસાબેન ગોદડી" className="font-gujarati" />
          </Field>
          <Field label="Tagline" htmlFor="s-tag" className="sm:col-span-2">
            <Input id="s-tag" defaultValue="ઘરની હૂંફ, હાથની મહેનત." className="font-gujarati" />
          </Field>
          <Field label="Support email" htmlFor="s-email">
            <Input id="s-email" type="email" defaultValue="hello@hansabengodadi.in" />
          </Field>
          <Field label="Support phone" htmlFor="s-phone">
            <Input id="s-phone" defaultValue="+91 265 246 8890" />
          </Field>
          <Field label="Address" htmlFor="s-addr" className="sm:col-span-2">
            <Textarea
              id="s-addr"
              defaultValue={"3rd Floor, Aarya Corporate\nAlkapuri, Vadodara 390007\nGujarat, India"}
            />
          </Field>
        </Panel>

        <div className="space-y-5">
          <Panel title="Delivery &amp; payments" bodyClassName="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Free delivery above (₹)" htmlFor="s-free">
              <Input id="s-free" type="number" defaultValue={1499} />
            </Field>
            <Field label="Standard shipping (₹)" htmlFor="s-std">
              <Input id="s-std" type="number" defaultValue={99} />
            </Field>
            <Field label="Express shipping (₹)" htmlFor="s-exp">
              <Input id="s-exp" type="number" defaultValue={199} />
            </Field>
            <Field label="Default currency" htmlFor="s-cur">
              <Select id="s-cur" defaultValue="INR">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </Select>
            </Field>
            <div className="space-y-2.5 sm:col-span-2">
              {[
                ["Accept UPI", true],
                ["Accept cards", true],
                ["Accept Cash on Delivery", true],
                ["Allow international shipping", false],
              ].map(([label, on]) => (
                <label
                  key={label as string}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-cream-400 px-4 py-2.5 text-[0.85rem] text-clay-500"
                >
                  {label as string}
                  <input
                    type="checkbox"
                    defaultChecked={on as boolean}
                    className="h-4 w-4 accent-terracotta-500"
                  />
                </label>
              ))}
            </div>
          </Panel>

          <Panel title="Prototype controls" bodyClassName="p-5">
            <p className="text-[0.85rem] leading-relaxed text-clay-400">
              Cart, wishlist and orders are stored in this browser&apos;s local
              storage. Clearing them restores the original sample data.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={resetPrototype}
            >
              <RotateCcw className="h-4 w-4" />
              Reset prototype data
            </Button>
          </Panel>

          <div className="flex justify-end">
            <Button type="submit" size="lg" loading={saving}>
              {!saving && <Save className="h-4 w-4" />}
              Save settings
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
