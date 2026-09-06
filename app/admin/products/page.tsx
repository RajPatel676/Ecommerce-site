"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { AdminHeading, Panel, Td, Th } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Badge, EmptyState } from "@/components/ui/misc";
import { useStore } from "@/components/store/store-provider";
import { CATEGORIES, PRODUCTS, SIZE_ORDER, SIZES } from "@/lib/data/products";
import type { Product } from "@/lib/types";
import { cn, inr } from "@/lib/utils";

interface Draft {
  id: string;
  name: string;
  gujaratiName: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  sizes: string[];
  stock: number;
  active: boolean;
  image: string;
}

const IMAGE_CHOICES = PRODUCTS.map((p) => p.images[0]);

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    gujaratiName: p.gujaratiName,
    description: p.description,
    price: p.price,
    mrp: p.mrp,
    category: p.category,
    sizes: [...p.sizes],
    stock: p.stock,
    active: true,
    image: p.images[0],
  };
}

const BLANK: Draft = {
  id: "",
  name: "",
  gujaratiName: "",
  description: "",
  price: 1499,
  mrp: 1999,
  category: "everyday",
  sizes: ["single", "double"],
  stock: 20,
  active: true,
  image: IMAGE_CHOICES[0],
};

export default function AdminProductsPage() {
  const { toast } = useStore();
  const [rows, setRows] = useState<Draft[]>(() => PRODUCTS.map(toDraft));
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) => !term || [r.name, r.gujaratiName, r.id, r.category].join(" ").toLowerCase().includes(term),
    );
  }, [rows, q]);

  const save = (d: Draft) => {
    if (!d.name.trim()) {
      toast({ title: "A product needs a name.", tone: "error" });
      return;
    }
    setRows((cur) => {
      const exists = cur.some((r) => r.id === d.id);
      if (exists) return cur.map((r) => (r.id === d.id ? d : r));
      const id = `GDP-${String(cur.length + 1).padStart(3, "0")}`;
      return [{ ...d, id }, ...cur];
    });
    toast({
      title: d.id ? "Product updated" : "Product added",
      description: `${d.name} — prototype state only.`,
      tone: "success",
    });
    setEditing(null);
  };

  const remove = (d: Draft) => {
    setRows((cur) => cur.filter((r) => r.id !== d.id));
    toast({ title: "Product removed", description: d.name });
  };

  const slugOf = (id: string) => PRODUCTS.find((p) => p.id === id)?.slug;

  return (
    <>
      <AdminHeading
        title="Products"
        description={`${rows.length} godadis in the catalogue.`}
        action={
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="h-11 pl-10"
              />
            </div>
            <Button onClick={() => setEditing({ ...BLANK })} className="shrink-0">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        }
      />

      <Panel>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No products match that search."
            description="Try a different name or category."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-[0.85rem]">
              <thead className="border-b border-cream-400 bg-cream-200 text-[0.72rem] uppercase tracking-[0.1em] text-clay-300">
                <tr>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-400">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-cream-100">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-cream-400 bg-cream-200">
                          <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-clay-600">{p.name}</p>
                          <p className="font-gujarati text-[0.75rem] text-clay-300">
                            {p.gujaratiName}
                          </p>
                          <p className="font-mono text-[0.7rem] text-clay-200">{p.id}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="capitalize text-clay-400">{p.category}</Td>
                    <Td>
                      <span className="font-semibold tabular-nums text-clay-600">
                        {inr(p.price)}
                      </span>
                      {p.mrp > p.price && (
                        <span className="ml-1.5 text-[0.75rem] text-clay-300 line-through">
                          {inr(p.mrp)}
                        </span>
                      )}
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          "font-semibold tabular-nums",
                          p.stock <= 12 ? "text-terracotta-500" : "text-clay-600",
                        )}
                      >
                        {p.stock}
                      </span>
                    </Td>
                    <Td>
                      <Badge variant={p.active ? "leaf" : "default"}>
                        {p.active ? "Active" : "Draft"}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing({ ...p })}
                          aria-label={`Edit ${p.name}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-clay-300 transition-colors hover:bg-cream-300 hover:text-clay-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {slugOf(p.id) && (
                          <Link
                            href={`/product/${slugOf(p.id)}`}
                            target="_blank"
                            aria-label={`View ${p.name}`}
                            className="grid h-8 w-8 place-items-center rounded-lg text-clay-300 transition-colors hover:bg-cream-300 hover:text-clay-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(p)}
                          aria-label={`Delete ${p.name}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-clay-300 transition-colors hover:bg-rose-50 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {editing && (
        <ProductDialog
          draft={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function ProductDialog({
  draft,
  onChange,
  onClose,
  onSave,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSave: (d: Draft) => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    onChange({ ...draft, [k]: v });
  const discount =
    draft.mrp > draft.price
      ? Math.round(((draft.mrp - draft.price) / draft.mrp) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 animate-fade-in bg-inverse/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-2xl animate-slide-up overflow-y-auto rounded-t-3xl bg-cream-100 shadow-lift sm:animate-scale-in sm:rounded-3xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-cream-400 bg-cream-100/95 px-5 py-4 backdrop-blur">
          <h2 className="font-display text-xl text-clay-600">
            {draft.id ? "Edit Product" : "Add Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full text-clay-400 hover:bg-cream-300"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
          className="grid gap-4 p-5 sm:grid-cols-2"
        >
          <Field label="Product name" htmlFor="p-name" required className="sm:col-span-2">
            <Input
              id="p-name"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Kutch Patchwork Godadi"
            />
          </Field>
          <Field label="Gujarati name" htmlFor="p-guj" className="sm:col-span-2">
            <Input
              id="p-guj"
              value={draft.gujaratiName}
              onChange={(e) => set("gujaratiName", e.target.value)}
              placeholder="કચ્છી પેચવર્ક ગોદડી"
              className="font-gujarati"
            />
          </Field>
          <Field label="Description" htmlFor="p-desc" className="sm:col-span-2">
            <Textarea
              id="p-desc"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="How it is made, what it is like to sleep under…"
            />
          </Field>

          <Field label="Price (₹)" htmlFor="p-price" required>
            <Input
              id="p-price"
              type="number"
              min={0}
              value={draft.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </Field>
          <Field
            label="Original price (₹)"
            htmlFor="p-mrp"
            hint={discount > 0 ? `${discount}% discount` : "No discount"}
          >
            <Input
              id="p-mrp"
              type="number"
              min={0}
              value={draft.mrp}
              onChange={(e) => set("mrp", Number(e.target.value))}
            />
          </Field>

          <Field label="Category" htmlFor="p-cat">
            <Select
              id="p-cat"
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Stock" htmlFor="p-stock">
            <Input
              id="p-stock"
              type="number"
              min={0}
              value={draft.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
            />
          </Field>

          <div className="sm:col-span-2">
            <p className="mb-2 text-[0.78rem] font-medium text-clay-400">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {SIZE_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    set(
                      "sizes",
                      draft.sizes.includes(s)
                        ? draft.sizes.filter((x) => x !== s)
                        : [...draft.sizes, s],
                    )
                  }
                  aria-pressed={draft.sizes.includes(s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors",
                    draft.sizes.includes(s)
                      ? "border-terracotta-400 bg-terracotta-50 text-terracotta-500"
                      : "border-cream-500 bg-card text-clay-400",
                  )}
                >
                  {SIZES[s].label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 text-[0.78rem] font-medium text-clay-400">
              Image (choose from the library)
            </p>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {IMAGE_CHOICES.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => set("image", img)}
                  aria-label="Select image"
                  aria-pressed={draft.image === img}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    draft.image === img
                      ? "border-terracotta-400"
                      : "border-cream-400 hover:border-clay-200",
                  )}
                >
                  <Image src={img} alt="" fill sizes="60px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-[0.85rem] text-clay-500">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => set("active", e.target.checked)}
                className="h-4 w-4 accent-terracotta-500"
              />
              Active — visible on the storefront
            </label>
          </div>

          <div className="flex gap-3 border-t border-cream-400 pt-4 sm:col-span-2">
            <Button type="submit" size="lg" className="flex-1">
              Save Product
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <p className="text-[0.72rem] text-clay-300 sm:col-span-2">
            Changes live in prototype state and reset when the page reloads.
          </p>
        </form>
      </div>
    </div>
  );
}
