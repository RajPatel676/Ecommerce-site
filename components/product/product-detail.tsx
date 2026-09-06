"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeIndianRupee,
  ChevronRight,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Product, SizeKey } from "@/lib/types";
import { SIZES, mrpForSize, priceForSize } from "@/lib/data/products";
import { useT } from "@/components/i18n/language-provider";
import {
  productCare,
  productDescription,
  productMaterial,
  productName,
  productPlace,
  productStory,
  productSubName,
  productWeight,
} from "@/lib/i18n/content";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Price, QuantityStepper, Rating } from "@/components/ui/misc";
import { cn, inr } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, isWished, toggleWish, hydrated, setCartOpen } = useStore();
  const router = useRouter();
  const t = useT();
  const ASSURANCES = [
    { icon: Truck, label: t.product.assurance.delivery },
    { icon: BadgeIndianRupee, label: t.product.assurance.cod },
    { icon: RotateCcw, label: t.product.assurance.returns },
    { icon: ShieldCheck, label: t.product.assurance.secure },
  ];

  const [size, setSize] = useState<SizeKey>(
    product.sizes.includes("double") ? "double" : product.sizes[0],
  );
  const [variant, setVariant] = useState(product.variants[0].key);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const activeVariant =
    product.variants.find((v) => v.key === variant) ?? product.variants[0];
  const gallery = [activeVariant.image, ...product.images.slice(1)];
  const price = priceForSize(product, size);
  const mrp = mrpForSize(product, size);
  const wished = hydrated && isWished(product.id);

  const buyNow = () => {
    addToCart(product, size, variant, qty, { silent: true, openDrawer: false });
    router.push("/checkout");
  };

  return (
    <div className="container py-6 lg:py-10">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[0.78rem] text-clay-300">
        <Link href="/" className="hover:text-terracotta-500">{t.nav.home}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-terracotta-500">{t.nav.shop}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-terracotta-500"
        >
          {product.category[0].toUpperCase() + product.category.slice(1)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-clay-400">{productName(product, t)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ------------------------------------------------------- gallery */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-cream-400 bg-cream-200">
            <Image
              key={gallery[active]}
              src={gallery[active]}
              alt={`${product.name} — view ${active + 1}`}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="animate-fade-in object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={active === i}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                  active === i
                    ? "border-terracotta-400"
                    : "border-cream-400 hover:border-clay-200",
                )}
              >
                <Image src={img} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- info */}
        <div>
          <p className="kicker">{productPlace(product, t)}</p>
          <h1 className="mt-2.5 text-[1.85rem] leading-tight text-clay-600 sm:text-[2.3rem]">
            {productName(product, t)}
          </h1>
          <p className="mt-1.5 text-[1.05rem] text-terracotta-400">
            {productSubName(product, t)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
            <span className="text-[0.8rem] text-clay-300">
              {product.stock > 12
                ? t.common.inStock
                : t.common.onlyLeftRun(product.stock)}
            </span>
          </div>

          <div className="mt-5">
            <Price price={price} mrp={mrp} size="lg" />
            <p className="mt-1 text-[0.78rem] text-clay-300">
              {t.product.inclusiveTax}
            </p>
          </div>

          <p className="mt-5 text-[0.95rem] leading-relaxed text-clay-400">
            {productDescription(product, t)}
          </p>

          {/* size */}
          <div className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
                {t.common.size}
              </h2>
              <Link
                href="/faq"
                className="text-[0.78rem] text-terracotta-500 hover:underline"
              >
                {t.common.sizeGuide}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-left transition-all",
                    size === s
                      ? "border-terracotta-400 bg-terracotta-50 ring-1 ring-terracotta-300"
                      : "border-cream-500 bg-card hover:border-clay-200",
                  )}
                >
                  <span className="block text-[0.88rem] font-medium text-clay-600">
                    {t.sizes[s]}
                  </span>
                  <span className="block text-[0.72rem] text-clay-300">
                    {SIZES[s].dimensions}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* variant */}
          <div className="mt-7">
            <h2 className="mb-3 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-clay-500">
              {t.common.pattern} ·{" "}
              <span className="font-normal normal-case tracking-normal text-clay-400">
                {activeVariant.label}
              </span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => {
                    setVariant(v.key);
                    setActive(0);
                  }}
                  aria-pressed={variant === v.key}
                  aria-label={v.label}
                  title={v.label}
                  className={cn(
                    "relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all",
                    variant === v.key
                      ? "border-terracotta-400 ring-2 ring-terracotta-200"
                      : "border-cream-500 hover:border-clay-200",
                  )}
                >
                  <Image src={v.image} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper qty={qty} onChange={setQty} />
            <p className="text-[0.82rem] text-clay-300">
              {inr(price)} × {qty} ={" "}
              <span className="font-semibold text-clay-500">{inr(price * qty)}</span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                addToCart(product, size, variant, qty);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="h-[1.1rem] w-[1.1rem]" />
              {t.common.addToCart}
            </Button>
            <Button size="lg" variant="secondary" className="flex-1" onClick={buyNow}>
              {t.common.buyNow}
            </Button>
            <Button
              size="lg"
              variant="outline"
              aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wished}
              className="sm:w-[3.25rem] sm:px-0"
              onClick={() => toggleWish(product.id)}
            >
              <Heart
                className={cn(
                  "h-[1.1rem] w-[1.1rem]",
                  wished && "fill-terracotta-500 text-terracotta-500",
                )}
              />
              <span className="sm:hidden">
                {wished ? t.common.saved : t.common.saveForLater}
              </span>
            </Button>
          </div>

          {/* assurances */}
          <ul className="mt-7 grid grid-cols-2 gap-3 rounded-2xl border border-cream-400 bg-cream-200 p-4">
            {ASSURANCES.map((a) => (
              <li
                key={a.label}
                className="flex items-center gap-2.5 text-[0.8rem] text-clay-400"
              >
                <a.icon className="h-4 w-4 shrink-0 text-terracotta-400" />
                {a.label}
              </li>
            ))}
          </ul>

          {/* expandable detail */}
          <Accordion
            className="mt-8 border-t border-cream-400"
            defaultOpen={["details"]}
            items={[
              {
                id: "details",
                title: t.product.details,
                content: (
                  <div className="space-y-3">
                    <p>{productStory(product, t)}</p>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2 text-[0.85rem]">
                      <div>
                        <dt className="text-clay-300">{t.product.weight}</dt>
                        <dd className="font-medium text-clay-500">{productWeight(product, t)}</dd>
                      </div>
                      <div>
                        <dt className="text-clay-300">{t.product.craftedIn}</dt>
                        <dd className="font-medium text-clay-500">{productPlace(product, t)}</dd>
                      </div>
                      <div>
                        <dt className="text-clay-300">{t.product.dimensions}</dt>
                        <dd className="font-medium text-clay-500">
                          {SIZES[size].dimensions}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-clay-300">{t.product.sku}</dt>
                        <dd className="font-medium text-clay-500">
                          {product.id}-{size.toUpperCase()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ),
              },
              {
                id: "material",
                title: t.product.material,
                content: (
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium text-clay-500">
                        {t.product.materialLabel}
                      </span>{" "}
                      {productMaterial(product, t)}
                    </p>
                    <ul className="list-disc space-y-1.5 pl-5 marker:text-terracotta-300">
                      {productCare(product, t).map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                id: "shipping",
                title: t.product.shipping,
                content: (
                  <ul className="space-y-2">
                    {t.product.shippingInfo.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ),
              },
              {
                id: "returns",
                title: t.product.returns,
                content: (
                  <ul className="space-y-2">
                    {t.product.returnsInfo.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
