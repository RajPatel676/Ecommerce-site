"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, X } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { useT } from "@/components/i18n/language-provider";
import { CATEGORIES, PRODUCTS } from "@/lib/data/products";
import { Price } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

export function searchProducts(q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return PRODUCTS.filter((p) =>
    [
      p.name,
      p.gujaratiName,
      p.tagline,
      p.description,
      p.material,
      p.craftedIn,
      p.category,
      ...p.categories,
      ...p.variants.map((v) => v.label),
    ]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, recentSearches, pushSearch, clearSearches } =
    useStore();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useT();

  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  if (!searchOpen) return null;

  const submit = (term: string) => {
    const v = term.trim();
    if (!v) return;
    pushSearch(v);
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(v)}`);
  };

  return (
    <div
      className="fixed inset-0 z-[85]"
      role="dialog"
      aria-modal="true"
      aria-label={t.search.label}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-inverse/45 backdrop-blur-[3px]"
        onClick={() => setSearchOpen(false)}
      />

      <div className="absolute inset-x-0 top-0 max-h-full animate-fade-up overflow-y-auto bg-cream-100 shadow-lift">
        <div className="container py-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(q);
            }}
            className="flex items-center gap-3"
          >
            <Search className="h-5 w-5 shrink-0 text-clay-300" aria-hidden />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.search.placeholder}
              aria-label={t.search.label}
              className="h-11 flex-1 border-0 bg-transparent font-display text-lg text-clay-600 placeholder:font-sans placeholder:text-[0.95rem] placeholder:text-clay-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label={t.common.close}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-clay-400 transition-colors hover:bg-cream-300"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="stitch-line mt-4 text-cream-500" aria-hidden />

          <div className="grid gap-8 py-6 md:grid-cols-[1fr_1.4fr]">
            {/* left: recents + categories */}
            <div className="space-y-7">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="kicker">{t.search.recent}</h3>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSearches}
                      className="text-[0.72rem] text-clay-300 hover:text-terracotta-500"
                    >
                      {t.search.clear}
                    </button>
                  )}
                </div>
                {recentSearches.length === 0 ? (
                  <p className="text-[0.85rem] text-clay-300">{t.search.nothingYet}</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {recentSearches.map((r) => (
                      <li key={r}>
                        <button
                          type="button"
                          onClick={() => setQ(r)}
                          className="flex items-center gap-1.5 rounded-full border border-cream-500 bg-card px-3 py-1.5 text-[0.8rem] text-clay-400 transition-colors hover:border-terracotta-200 hover:text-terracotta-500"
                        >
                          <Clock className="h-3.5 w-3.5 text-clay-200" />
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="kicker mb-3">{t.search.popular}</h3>
                <ul className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <li key={c.key}>
                      <Link
                        href={`/shop?category=${c.key}`}
                        onClick={() => setSearchOpen(false)}
                        className="inline-block rounded-full border border-cream-500 bg-card px-3.5 py-1.5 text-[0.8rem] text-clay-400 transition-colors hover:border-terracotta-200 hover:bg-terracotta-50 hover:text-terracotta-500"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* right: live results */}
            <div>
              <h3 className="kicker mb-3">
                {q ? t.search.matches(searchProducts(q).length) : t.search.trending}
              </h3>
              <ul className="space-y-1">
                {(q ? results : PRODUCTS.filter((p) => p.featured).slice(0, 5)).map(
                  (p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={() => {
                          pushSearch(q || p.name);
                          setSearchOpen(false);
                        }}
                        className="flex items-center gap-3.5 rounded-xl p-2 transition-colors hover:bg-cream-200"
                      >
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-cream-400">
                          <Image
                            src={p.images[0]}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[0.95rem] text-clay-600">
                            {p.name}
                          </p>
                          <p className="truncate font-gujarati text-[0.75rem] text-clay-300">
                            {p.gujaratiName}
                          </p>
                        </div>
                        <Price price={p.price} mrp={p.mrp} size="sm" />
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              {q && results.length === 0 && (
                <div className="rounded-2xl border border-dashed border-cream-500 p-8 text-center">
                  <p className="font-display text-[1.05rem] text-clay-600">
                    {t.search.noMatch(q)}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] text-clay-300">
                    {t.search.noMatchHint}
                  </p>
                </div>
              )}

              {q && results.length > 0 && (
                <button
                  type="button"
                  onClick={() => submit(q)}
                  className={cn(
                    "mt-3 w-full rounded-xl border border-cream-500 py-2.5 text-[0.85rem] font-medium text-clay-500",
                    "transition-colors hover:border-terracotta-200 hover:text-terracotta-500",
                  )}
                >
                  {t.search.seeAll(q)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
