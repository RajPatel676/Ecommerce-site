import type {
  Order,
  OrderItem,
  OrderStatus,
  SizeKey,
  TimelineEvent,
} from "@/lib/types";
import { TRACKING_FLOW } from "@/lib/types";
import { STEP_NOTE } from "@/lib/status";
import { CUSTOMERS } from "@/lib/data/customers";
import { PRODUCTS, SIZES, priceForSize } from "@/lib/data/products";

/** Hours after order placement at which each step typically happens. */
const STEP_OFFSET_HOURS: Record<OrderStatus, number> = {
  pending_payment: 0,
  payment_confirmed: 0.02,
  confirmed: 0.75,
  packed: 22.8,
  shipped: 31.2,
  in_transit: 52,
  out_for_delivery: 79,
  delivered: 84,
  cancelled: 6,
};

export function buildTimeline(
  placedAt: string,
  status: OrderStatus,
): TimelineEvent[] {
  if (status === "cancelled") {
    return [
      { status: "pending_payment", at: placedAt, note: STEP_NOTE.pending_payment },
      {
        status: "cancelled",
        at: shift(placedAt, STEP_OFFSET_HOURS.cancelled),
        note: STEP_NOTE.cancelled,
      },
    ];
  }
  const upto = TRACKING_FLOW.indexOf(status);
  return TRACKING_FLOW.slice(0, upto + 1).map((s) => ({
    status: s,
    at: shift(placedAt, STEP_OFFSET_HOURS[s]),
    note: STEP_NOTE[s],
  }));
}

function shift(iso: string, hours: number) {
  const d = new Date(iso);
  d.setTime(d.getTime() + hours * 3600_000);
  return d.toISOString();
}

function line(
  productId: string,
  size: SizeKey,
  qty = 1,
  variantIndex = 0,
): OrderItem {
  const p = PRODUCTS.find((x) => x.id === productId)!;
  const v = p.variants[variantIndex] ?? p.variants[0];
  return {
    productId: p.id,
    name: p.name,
    gujaratiName: p.gujaratiName,
    image: v.image,
    size,
    variant: v.key,
    qty,
    price: priceForSize(p, size),
  };
}

interface Draft {
  id: string;
  customerId: string;
  house: string;
  street: string;
  items: OrderItem[];
  paymentMethod: Order["paymentMethod"];
  deliveryMethod: Order["deliveryMethod"];
  status: OrderStatus;
  placedAt: string;
  discount?: number;
  couponCode?: string;
  trackingNumber: string;
}

const DRAFTS: Draft[] = [
  {
    id: "GD20260906001",
    customerId: "CUS-1002",
    house: "B-402, Shreeji Residency",
    street: "Gotri Road",
    items: [line("GDP-001", "double", 1), line("GDP-006", "single", 1)],
    paymentMethod: "upi",
    deliveryMethod: "standard",
    status: "shipped",
    placedAt: "2026-09-06T05:00:00.000Z", // 10:30 AM IST
    trackingNumber: "MG123456789",
  },
  {
    id: "GD20260905014",
    customerId: "CUS-1003",
    house: "12, Sneh Bungalows",
    street: "Adajan",
    items: [line("GDP-005", "king", 1)],
    paymentMethod: "card",
    deliveryMethod: "express",
    status: "out_for_delivery",
    placedAt: "2026-09-05T04:10:00.000Z",
    trackingNumber: "MG998211043",
  },
  {
    id: "GD20260904009",
    customerId: "CUS-1001",
    house: "A-9, Satyam Flats",
    street: "Navrangpura",
    items: [line("GDP-003", "double", 1), line("GDP-008", "single", 2)],
    paymentMethod: "upi",
    deliveryMethod: "standard",
    status: "in_transit",
    placedAt: "2026-09-04T09:35:00.000Z",
    discount: 250,
    couponCode: "WARMTH250",
    trackingNumber: "MG774300512",
  },
  {
    id: "GD20260903022",
    customerId: "CUS-1007",
    house: "Plot 34, Mundra Road",
    street: "Bhuj",
    items: [line("GDP-010", "double", 1)],
    paymentMethod: "cod",
    deliveryMethod: "standard",
    status: "packed",
    placedAt: "2026-09-03T06:20:00.000Z",
    trackingNumber: "MG661209874",
  },
  {
    id: "GD20260902007",
    customerId: "CUS-1005",
    house: "301, Kalpataru Heights",
    street: "Kalawad Road",
    items: [line("GDP-014", "double", 1), line("GDP-011", "single", 1)],
    paymentMethod: "upi",
    deliveryMethod: "express",
    status: "confirmed",
    placedAt: "2026-09-02T11:05:00.000Z",
    trackingNumber: "MG530918226",
  },
  {
    id: "GD20260901031",
    customerId: "CUS-1010",
    house: "C-77, Vasant Kunj",
    street: "Sector B",
    items: [line("GDP-013", "king", 1)],
    paymentMethod: "card",
    deliveryMethod: "express",
    status: "delivered",
    placedAt: "2026-09-01T03:45:00.000Z",
    trackingNumber: "MG410772639",
  },
  {
    id: "GD20260830018",
    customerId: "CUS-1006",
    house: "Flat 6, Brigade Gardenia",
    street: "JP Nagar",
    items: [line("GDP-002", "double", 1), line("GDP-006", "single", 1)],
    paymentMethod: "upi",
    deliveryMethod: "standard",
    status: "delivered",
    placedAt: "2026-08-30T07:15:00.000Z",
    discount: 130,
    couponCode: "GODADI10",
    trackingNumber: "MG309461177",
  },
  {
    id: "GD20260828005",
    customerId: "CUS-1004",
    house: "702, Ashray Towers",
    street: "Andheri West",
    items: [line("GDP-003", "single", 1)],
    paymentMethod: "cod",
    deliveryMethod: "standard",
    status: "delivered",
    placedAt: "2026-08-28T10:00:00.000Z",
    trackingNumber: "MG288110394",
  },
  {
    id: "GD20260906023",
    customerId: "CUS-1008",
    house: "14, Kalyani Nagar",
    street: "Lane 5",
    items: [line("GDP-006", "single", 1)],
    paymentMethod: "upi",
    deliveryMethod: "standard",
    status: "pending_payment",
    placedAt: "2026-09-06T08:40:00.000Z",
    trackingNumber: "MG901233781",
  },
  {
    id: "GD20260827011",
    customerId: "CUS-1009",
    house: "B-12, Sector 21",
    street: "Gandhinagar",
    items: [line("GDP-015", "double", 1)],
    paymentMethod: "card",
    deliveryMethod: "standard",
    status: "cancelled",
    placedAt: "2026-08-27T05:30:00.000Z",
    trackingNumber: "MG177602948",
  },
  {
    id: "GD20260826002",
    customerId: "CUS-1003",
    house: "12, Sneh Bungalows",
    street: "Adajan",
    items: [line("GDP-016", "double", 2)],
    paymentMethod: "upi",
    deliveryMethod: "standard",
    status: "delivered",
    placedAt: "2026-08-26T04:55:00.000Z",
    trackingNumber: "MG155938220",
  },
  {
    id: "GD20260825016",
    customerId: "CUS-1007",
    house: "Plot 34, Mundra Road",
    street: "Bhuj",
    items: [line("GDP-007", "double", 1), line("GDP-012", "king", 1)],
    paymentMethod: "cod",
    deliveryMethod: "express",
    status: "delivered",
    placedAt: "2026-08-25T09:20:00.000Z",
    trackingNumber: "MG144820073",
  },
];

export const FREE_SHIPPING_THRESHOLD = 1499;
export const STANDARD_SHIPPING = 99;
export const EXPRESS_SHIPPING = 199;

function hydrate(d: Draft): Order {
  const c = CUSTOMERS.find((x) => x.id === d.customerId)!;
  const subtotal = d.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = d.discount ?? 0;
  const base = subtotal - discount;
  const shipping =
    d.deliveryMethod === "express"
      ? EXPRESS_SHIPPING
      : base >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING;
  const total = base + shipping;
  const eta = new Date(d.placedAt);
  eta.setDate(eta.getDate() + (d.deliveryMethod === "express" ? 2 : 4));

  return {
    id: d.id,
    customerId: d.customerId,
    customer: {
      name: c.name,
      phone: c.phone,
      email: c.email,
      house: d.house,
      street: d.street,
      city: c.city,
      state: c.state,
      pincode:
        { Ahmedabad: "380009", Vadodara: "390021", Surat: "395009", Mumbai: "400058", Rajkot: "360005", Bengaluru: "560078", Bhuj: "370001", Pune: "411006", Gandhinagar: "382021", Delhi: "110070" }[c.city] ?? "390001",
    },
    items: d.items,
    subtotal,
    discount,
    shipping,
    total,
    couponCode: d.couponCode,
    paymentMethod: d.paymentMethod,
    paymentStatus:
      d.status === "cancelled"
        ? "refunded"
        : d.paymentMethod === "cod"
          ? d.status === "delivered"
            ? "paid"
            : "pending"
          : d.status === "pending_payment"
            ? "pending"
            : "paid",
    deliveryMethod: d.deliveryMethod,
    status: d.status,
    courier: "Mock Express",
    trackingNumber: d.trackingNumber,
    placedAt: d.placedAt,
    estimatedDelivery: eta.toISOString(),
    timeline: buildTimeline(d.placedAt, d.status),
  };
}

export const SEED_ORDERS: Order[] = DRAFTS.map(hydrate);

/** The order id printed on the demo confirmation + tracking screens. */
export const DEMO_ORDER_ID = "GD20260906001";

