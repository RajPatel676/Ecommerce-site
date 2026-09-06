"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { EmptyState, Price, ProductCardSkeleton, Rating } from "@/components/ui/misc";
import { PRODUCTS } from "@/lib/data/products";

export default function WishlistPage() {
  const { wishlist, toggleWish, addToCart, hydrated } = useStore();
  const saved = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-[1.9rem] leading-tight text-clay-600 sm:text-[2.3rem]">
          Wishlist
        </h1>
        <p className="mt-1.5 text-[0.9rem] text-clay-300">
          {hydrated
            ? saved.length === 0
              ? "Nothing saved yet."
              : `${saved.length} ${saved.length === 1 ? "godadi" : "godadis"} saved for later.`
            : "Loading your saved godadis…"}
        </p>
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Save the ones you love."
          gujarati="તમને ગમતી ગોદડીઓ અહીં સાચવો."
          description="Tap the heart on any godadi and it will wait for you here."
          actionLabel="Explore Godadi"
          actionHref="/shop"
          className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
        />
      ) : (
        <ul className="space-y-4">
          {saved.map((p) => (
            <li
              key={p.id}
              className="card-surface flex flex-col gap-4 p-4 transition-shadow hover:shadow-lift sm:flex-row sm:items-center"
            >
              <Link
                href={`/product/${p.slug}`}
                className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-cream-400 bg-cream-200 sm:aspect-square sm:w-28"
              >
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width:640px) 100vw, 112px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${p.slug}`}
                  className="font-display text-[1.08rem] leading-snug text-clay-600 hover:text-terracotta-500"
                >
                  {p.name}
                </Link>
                <p className="mt-0.5 font-gujarati text-[0.8rem] text-clay-300">
                  {p.gujaratiName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <Rating value={p.rating} count={p.reviewCount} />
                  <Price price={p.price} mrp={p.mrp} size="sm" />
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  onClick={() =>
                    addToCart(
                      p,
                      p.sizes.includes("double") ? "double" : p.sizes[0],
                      p.variants[0].key,
                      1,
                    )
                  }
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Remove ${p.name} from wishlist`}
                  onClick={() => toggleWish(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
