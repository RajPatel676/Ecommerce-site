import type { OrderStatus, PaymentStatus } from "@/lib/types";

/** Badge label — how a status reads in a list or on a chip. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  payment_confirmed: "Payment Confirmed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Timeline label — how a status reads as a step on the tracking page. */
export const STEP_LABEL: Record<OrderStatus, string> = {
  ...STATUS_LABEL,
  pending_payment: "Order Placed",
  confirmed: "Order Confirmed",
};

export const STEP_NOTE: Record<OrderStatus, string> = {
  pending_payment: "We have received your order.",
  payment_confirmed: "Payment received and verified.",
  confirmed: "Your godadi has been reserved from our workshop.",
  packed: "Wrapped in muslin and boxed.",
  shipped: "Handed over to the courier.",
  in_transit: "On its way to your city.",
  out_for_delivery: "With the delivery partner today.",
  delivered: "Delivered. We hope it keeps you warm.",
  cancelled: "This order was cancelled.",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  pending_payment: "bg-mustard-50 text-mustard-400 border-mustard-200",
  payment_confirmed: "bg-leaf-50 text-leaf-400 border-leaf-200",
  confirmed: "bg-leaf-50 text-leaf-400 border-leaf-200",
  packed: "bg-clay-50 text-clay-400 border-clay-200",
  shipped: "bg-terracotta-50 text-terracotta-500 border-terracotta-200",
  in_transit: "bg-terracotta-50 text-terracotta-500 border-terracotta-200",
  out_for_delivery: "bg-terracotta-100 text-terracotta-600 border-terracotta-300",
  delivered: "bg-leaf-100 text-leaf-500 border-leaf-200",
  cancelled: "bg-rose-50 text-rose-300 border-rose-100",
};

export const PAYMENT_TONE: Record<PaymentStatus, string> = {
  paid: "bg-leaf-100 text-leaf-500 border-leaf-200",
  pending: "bg-mustard-50 text-mustard-400 border-mustard-200",
  refunded: "bg-cream-300 text-clay-400 border-cream-500",
  failed: "bg-rose-50 text-rose-300 border-rose-100",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
};

export const PAYMENT_METHOD_LABEL = {
  upi: "UPI",
  card: "Credit / Debit Card",
  cod: "Cash on Delivery",
} as const;
