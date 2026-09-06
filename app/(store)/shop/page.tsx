import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import { ProductCardSkeleton } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Shop Our Godadi",
  description:
    "Browse handmade Gujarati godadis — everyday, premium, baby and traditional patchwork, in single, double and king.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopClient />
    </Suspense>
  );
}

function ShopFallback() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
