"use client";

import dynamic from "next/dynamic";
import { useStore } from "@/components/store/store-provider";

/**
 * The cart drawer, search overlay and mobile nav are closed on almost every
 * page view, but their code used to sit in the first-load bundle of every
 * route. Loading them on first open moves that weight off the critical path;
 * each is a single small chunk fetched while the open animation runs.
 */
const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer),
  { ssr: false },
);
const SearchOverlay = dynamic(
  () => import("@/components/search/search-overlay").then((m) => m.SearchOverlay),
  { ssr: false },
);
const MobileNav = dynamic(
  () => import("@/components/layout/mobile-nav").then((m) => m.MobileNav),
  { ssr: false },
);

export function Overlays() {
  const { cartOpen, searchOpen, menuOpen } = useStore();

  // `mounted` stays true once opened, so re-opening is instant and the
  // drawer's own exit state is preserved.
  return (
    <>
      {cartOpen && <CartDrawer />}
      {searchOpen && <SearchOverlay />}
      {menuOpen && <MobileNav />}
    </>
  );
}
