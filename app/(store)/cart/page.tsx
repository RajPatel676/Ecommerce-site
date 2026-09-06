import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = { title: "Your Cart" };

export default function CartPage() {
  return <CartPageClient />;
}
