"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import {
  EmptyState,
  ProductCardSkeleton,
  SectionHeading,
} from "@/components/ui/misc";
import { CATEGORIES, PRICE_BOUNDS, PRODUCTS, SIZES, SIZE_ORDER } from "@/lib/data/products";
import type { CategoryKey, SizeKey } from "@/lib/types";
import { cn, inr } from "@/lib/utils";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Best Rated" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

const PRICE_STEPS = [899, 1299, 1499, 1799, 2799];

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cats, setCats] = useState<CategoryKey[]>(
    params.get("category") ? [params.get("category") as CategoryKey] : [],
  );
  const [sizes, setSizes] = useState<SizeKey[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_BOUNDS.max);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // brief skeleton pass so the grid never pops in unstyled
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(t);
  }, []);

  // keep the URL readable/shareable
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (cats.length === 1) sp.set("category", cats[0]);
    const next = sp.toString();
    router.replace(next ? `/shop?${next}` : "/shop", { scroll: false });
  }, [q, cats, router]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (
        term &&
        ![p.name, p.gujaratiName, p.tagline, p.description, p.material, p.craftedIn, ...p.categories]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
        return false;
      if (cats.length && !p.categories.some((c) => cats.includes(c))) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating,
        );
    }
    return list;
  }, [q, cats, sizes, maxPrice, sort]);

  const activeCount =
    (q ? 1 : 0) + cats.length + sizes.length + (maxPrice < PRICE_BOUNDS.max ? 1 : 0);

  const reset = () => {
    setQ("");
    setCats([]);
    setSizes([]);
    setMaxPrice(PRICE_BOUNDS.max);
    setSort("featured");
  };

  const toggle = <T,>(arr: T[], v: T, set: (n: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const Filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="kicker mb-3.5">Category</legend>
        <ul className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <label className="flex cursor-pointer items-center gap-2.5 text-[0.88rem] text-clay-400 transition-colors hover:text-terracotta-500">
                <input
                  type="checkbox"
                  checked={cats.includes(c.key)}
                  onChange={() => toggle(cats, c.key, setCats)}
                  className="h-4 w-4 rounded border-cream-500 text-terracotta-500 accent-terracotta-500"
                />
                <span className="flex-1">{c.name}</span>
                <span className="text-[0.72rem] text-clay-200">
                  {PRODUCTS.filter((p) => p.categories.includes(c.key)).length}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="kicker mb-3.5">Size</legend>
        <div className="flex flex-wrap gap-2">
          {SIZE_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(sizes, s, setSizes)}
              aria-pressed={sizes.includes(s)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors",
                sizes.includes(s)
                  ? "border-terracotta-400 bg-terracotta-50 text-terracotta-500"
                  : "border-cream-500 bg-card text-clay-400 hover:border-clay-200",
              )}
            >
              {SIZES[s].label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="kicker mb-3.5">Price</legend>
        <input
          type="range"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-terracotta-500"
        />
        <div className="mt-2 flex justify-between text-[0.78rem] text-clay-300">
          <span>{inr(PRICE_BOUNDS.min)}</span>
          <span className="font-semibold text-clay-500">Up to {inr(maxPrice)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRICE_STEPS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMaxPrice(p)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[0.72rem] transition-colors",
                maxPrice === p
                  ? "border-terracotta-400 bg-terracotta-50 text-terracotta-500"
                  : "border-cream-500 text-clay-300 hover:border-clay-200",
              )}
            >
              ≤ {inr(p)}
            </button>
          ))}
        </div>
      </fieldset>

      {activeCount > 0 && (
        <Button variant="subtle" size="sm" full onClick={reset}>
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <section className="border-b border-cream-400 bg-cream-200 py-10 weave lg:py-14">
        <div className="container">
          <SectionHeading
            align="left"
            kicker="The collection"
            title="Shop Our Godadi"
            gujarati="અમારી ગોદડીઓ"
            description="Sixteen designs, all pieced and quilted by hand. Filter by size, price or the room you have in mind."
          />
        </div>
      </section>

      <div className="container py-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          {/* desktop filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <div className="relative mb-7">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search godadi…"
                  aria-label="Search products"
                  className="h-11 pl-10"
                />
              </div>
              {Filters}
            </div>
          </aside>

          <div>
            {/* toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1 lg:hidden">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-200" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search godadi…"
                  aria-label="Search products"
                  className="h-11 pl-10"
                />
              </div>

              <Button
                variant="outline"
                size="md"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta-500 px-1 text-[0.65rem] font-bold text-on-accent">
                    {activeCount}
                  </span>
                )}
              </Button>

              <p className="hidden text-[0.85rem] text-clay-300 lg:block">
                <span className="font-semibold text-clay-500">{results.length}</span>{" "}
                {results.length === 1 ? "godadi" : "godadis"}
              </p>

              <div className="ml-auto flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="hidden text-[0.8rem] text-clay-300 sm:block"
                >
                  Sort by
                </label>
                <Select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-[11.5rem]"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* active chips */}
            {activeCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {q && (
                  <Chip label={`“${q}”`} onClear={() => setQ("")} />
                )}
                {cats.map((c) => (
                  <Chip
                    key={c}
                    label={CATEGORIES.find((x) => x.key === c)!.name}
                    onClear={() => toggle(cats, c, setCats)}
                  />
                ))}
                {sizes.map((s) => (
                  <Chip
                    key={s}
                    label={SIZES[s].label}
                    onClear={() => toggle(sizes, s, setSizes)}
                  />
                ))}
                {maxPrice < PRICE_BOUNDS.max && (
                  <Chip
                    label={`Under ${inr(maxPrice)}`}
                    onClear={() => setMaxPrice(PRICE_BOUNDS.max)}
                  />
                )}
              </div>
            )}

            {/* grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No godadi matches those filters."
                gujarati="કોઈ ગોદડી મળી નથી."
                description="Try widening the price range or clearing a filter or two."
                actionLabel="Clear all filters"
                onAction={reset}
                className="rounded-2xl border border-dashed border-cream-500"
              />
            ) : (
              <div className="grid animate-fade-in grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 4} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter sheet */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[75] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="absolute inset-0 animate-fade-in bg-inverse/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] animate-slide-up overflow-y-auto rounded-t-3xl bg-cream-100 p-5 shadow-drawer">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-clay-600">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="grid h-10 w-10 place-items-center rounded-full text-clay-400 hover:bg-cream-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {Filters}
            <Button full size="lg" className="mt-7" onClick={() => setFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? "godadi" : "godadis"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-500 bg-card py-1 pl-3 pr-1.5 text-[0.78rem] text-clay-400">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
        className="grid h-5 w-5 place-items-center rounded-full text-clay-200 transition-colors hover:bg-cream-300 hover:text-clay-500"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
