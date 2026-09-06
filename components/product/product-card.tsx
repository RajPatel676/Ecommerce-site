"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Price, ProductBadge, Rating } from "@/components/ui/misc";
import { useStore } from "@/components/store/store-provider";

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}) {
  const { addToCart, isWished, toggleWish, hydrated } = useStore();
  const wished = hydrated && isWished(product.id);
  const defaultSize = product.sizes.includes("double") ? "double" : product.sizes[0];

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-2xl border border-cream-400 bg-cream-200">
        <Link
          href={`/product/${product.slug}`}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={product.images[0]}
              alt={`${product.name} — handmade Gujarati godadi`}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            />
            {/* second image cross-fades in on hover */}
            <Image
              src={product.images[1]}
              alt=""
              aria-hidden
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <ProductBadge badge={product.badge} />
          <button
            type="button"
            onClick={() => toggleWish(product.id)}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={wished}
            className="pointer-events-auto ml-auto grid h-9 w-9 place-items-center rounded-full bg-card/90 text-clay-400 shadow-soft backdrop-blur transition-all hover:scale-105 hover:text-terracotta-500"
          >
            <Heart
              className={cn(
                "h-[1.05rem] w-[1.05rem] transition-colors",
                wished && "fill-terracotta-500 text-terracotta-500",
              )}
            />
          </button>
        </div>

        {product.stock <= 12 && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-inverse/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.09em] text-on-inverse backdrop-blur">
            Only {product.stock} left
          </span>
        )}

        {!compact && (
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
            <button
              type="button"
              onClick={() =>
                addToCart(product, defaultSize, product.variants[0].key, 1)
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-inverse text-sm font-medium text-on-accent shadow-lift transition-colors hover:bg-terracotta-500"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.02rem] leading-snug text-clay-600">
            <Link href={`/product/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1 font-gujarati text-[0.8rem] text-clay-300">
          {product.gujaratiName}
        </p>
        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-clay-300">
            {product.tagline}
          </p>
        )}
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-2.5">
          <Price price={product.price} mrp={product.mrp} />
        </div>

        {!compact && (
          <button
            type="button"
            onClick={() => addToCart(product, defaultSize, product.variants[0].key, 1)}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-clay-200 text-[0.82rem] font-medium text-clay-500 transition-colors hover:border-terracotta-300 hover:bg-terracotta-50 hover:text-terracotta-500 lg:hidden"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
