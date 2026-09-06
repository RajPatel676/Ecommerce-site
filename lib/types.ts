export type SizeKey = "single" | "double" | "king";

export interface ProductSize {
  key: SizeKey;
  label: string;
  dimensions: string;
  /** Amount added to the base price for this size. */
  priceDelta: number;
}

export interface ProductVariant {
  key: string;
  label: string;
  gujarati?: string;
  swatch: string;
  image: string;
}

export type CategoryKey =
  | "everyday"
  | "premium"
  | "baby"
  | "double"
  | "single"
  | "patchwork";

export interface Product {
  id: string;
  slug: string;
  name: string;
  gujaratiName: string;
  tagline: string;
  description: string;
  story: string;
  price: number;
  mrp: number;
  category: CategoryKey;
  categories: CategoryKey[];
  sizes: SizeKey[];
  variants: ProductVariant[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  material: string;
  care: string[];
  weight: string;
  craftedIn: string;
  badge?: "bestseller" | "new" | "limited" | "handloom";
  featured?: boolean;
  createdAt: string;
}

/* ------------------------------------------------------------------ cart */

export interface CartLine {
  key: string; // productId::size::variant
  productId: string;
  size: SizeKey;
  variant: string;
  qty: number;
}

export interface WishlistEntry {
  productId: string;
  addedAt: string;
}

/* ---------------------------------------------------------------- orders */

export const ORDER_STATUSES = [
  "pending_payment",
  "payment_confirmed",
  "confirmed",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The forward-moving states, in the order a parcel passes through them. */
export const TRACKING_FLOW: OrderStatus[] = [
  "pending_payment",
  "payment_confirmed",
  "confirmed",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export type PaymentMethod = "upi" | "card" | "cod";
export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type DeliveryMethod = "standard" | "express";

export interface Address {
  name: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  gujaratiName: string;
  image: string;
  size: SizeKey;
  variant: string;
  qty: number;
  price: number;
}

export interface TimelineEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  courier: string;
  trackingNumber: string;
  placedAt: string;
  estimatedDelivery: string;
  timeline: TimelineEvent[];
}

/* ------------------------------------------------------------- customers */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  orders: number;
  spent: number;
  joinedAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  uses: number;
  active: boolean;
  expiresAt: string;
}
