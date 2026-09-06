"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Address,
  CartLine,
  Coupon,
  DeliveryMethod,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  SizeKey,
} from "@/lib/types";
import { TRACKING_FLOW } from "@/lib/types";
import { PRODUCTS, SIZES, priceForSize, mrpForSize } from "@/lib/data/products";
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  SEED_ORDERS,
  STANDARD_SHIPPING,
  buildTimeline,
} from "@/lib/data/orders";
import { findCoupon } from "@/lib/data/customers";
import { STEP_NOTE } from "@/lib/status";

/* ------------------------------------------------------------------ types */

export interface DetailedLine extends CartLine {
  product: Product;
  unitPrice: number;
  unitMrp: number;
  lineTotal: number;
  sizeLabel: string;
  variantLabel: string;
  image: string;
}

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
  href?: string;
  hrefLabel?: string;
}

interface PlaceOrderInput {
  address: Address;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
}

interface StoreValue {
  hydrated: boolean;

  /* cart */
  lines: DetailedLine[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: Coupon | null;
  freeShippingGap: number;
  addToCart: (
    p: Product,
    size: SizeKey,
    variant: string,
    qty?: number,
    opts?: { silent?: boolean; openDrawer?: boolean },
  ) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingFor: (method: DeliveryMethod) => number;

  /* wishlist */
  wishlist: string[];
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;

  /* orders */
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  myOrders: Order[];

  /* recent searches */
  recentSearches: string[];
  pushSearch: (q: string) => void;
  clearSearches: () => void;

  /* ui */
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  /* toasts */
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/* ------------------------------------------------------------- persistence */

const KEY = {
  cart: "vg.cart.v1",
  wish: "vg.wishlist.v1",
  orders: "vg.orders.v1",
  coupon: "vg.coupon.v1",
  searches: "vg.searches.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — the prototype still works in memory */
  }
}

/**
 * Orders embed the image path at the moment they are placed, so an order
 * saved before the artwork moved to WebP still points at a .jpg that no
 * longer exists. Rewrite those on read rather than dropping the history.
 */
function migrateOrder(o: Order): Order {
  let touched = false;
  const items = o.items.map((it) => {
    if (it.image.startsWith("/img/") && it.image.endsWith(".jpg")) {
      touched = true;
      return { ...it, image: it.image.replace(/\.jpg$/, ".webp") };
    }
    return it;
  });
  return touched ? { ...o, items } : o;
}

/** The signed-in shopper for the prototype. */
export const DEMO_CUSTOMER_ID = "CUS-1002";

/* ---------------------------------------------------------------- provider */

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* -- load once on the client so SSR markup stays deterministic ---------- */
  useEffect(() => {
    setCart(read<CartLine[]>(KEY.cart, []));
    setWishlist(read<string[]>(KEY.wish, []));
    setCouponCode(read<string | null>(KEY.coupon, null));
    setRecentSearches(read<string[]>(KEY.searches, ["cotton", "baby godadi"]));

    const stored = read<Order[]>(KEY.orders, []).map(migrateOrder);
    if (stored.length) {
      const byId = new Map(stored.map((o) => [o.id, o]));
      for (const seed of SEED_ORDERS) if (!byId.has(seed.id)) byId.set(seed.id, seed);
      setOrders(
        [...byId.values()].sort(
          (a, b) => +new Date(b.placedAt) - +new Date(a.placedAt),
        ),
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(KEY.cart, cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEY.wish, wishlist);
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEY.orders, orders);
  }, [orders, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEY.coupon, couponCode);
  }, [couponCode, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEY.searches, recentSearches);
  }, [recentSearches, hydrated]);

  /* -- close every overlay when the route changes ------------------------
     This lives here rather than inside each overlay: the drawers are mounted
     on open, so an effect inside them would fire on mount and close them
     again immediately. */
  const pathname = usePathname();
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;
    setCartOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  /* -- lock body scroll while an overlay is open ------------------------- */
  useEffect(() => {
    const open = cartOpen || searchOpen || menuOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen, menuOpen]);

  /* -- toasts ------------------------------------------------------------ */
  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((cur) => [...cur.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  /* -- cart -------------------------------------------------------------- */
  const addToCart = useCallback<StoreValue["addToCart"]>(
    (p, size, variant, qty = 1, opts) => {
      const key = `${p.id}::${size}::${variant}`;
      setCart((cur) => {
        const found = cur.find((l) => l.key === key);
        if (found) {
          return cur.map((l) =>
            l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l,
          );
        }
        return [...cur, { key, productId: p.id, size, variant, qty }];
      });
      const willOpenDrawer = opts?.openDrawer !== false;
      // The drawer is its own confirmation — a toast on top of it just
      // covers the line the shopper wants to see.
      if (!opts?.silent && !willOpenDrawer) {
        toast({
          title: "Added to cart",
          description: `${p.name} · ${SIZES[size].label}`,
          tone: "success",
          href: "/cart",
          hrefLabel: "View cart",
        });
      }
      if (willOpenDrawer) setCartOpen(true);
    },
    [toast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setCart((cur) =>
      qty <= 0
        ? cur.filter((l) => l.key !== key)
        : cur.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l)),
    );
  }, []);

  const removeLine = useCallback(
    (key: string) => {
      setCart((cur) => cur.filter((l) => l.key !== key));
      toast({ title: "Removed from cart" });
    },
    [toast],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, []);

  const lines: DetailedLine[] = useMemo(
    () =>
      cart.flatMap((l) => {
        const product = PRODUCTS.find((p) => p.id === l.productId);
        if (!product) return [];
        const variant =
          product.variants.find((v) => v.key === l.variant) ?? product.variants[0];
        const unitPrice = priceForSize(product, l.size);
        return [
          {
            ...l,
            product,
            unitPrice,
            unitMrp: mrpForSize(product, l.size),
            lineTotal: unitPrice * l.qty,
            sizeLabel: SIZES[l.size].label,
            variantLabel: variant.label,
            image: variant.image,
          },
        ];
      }),
    [cart],
  );

  const cartCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.lineTotal, 0),
    [lines],
  );

  const coupon = useMemo(
    () => (couponCode ? (findCoupon(couponCode) ?? null) : null),
    [couponCode],
  );

  const discount = useMemo(() => {
    if (!coupon || subtotal < coupon.minOrder) return 0;
    return coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  }, [coupon, subtotal]);

  const shippingFor = useCallback(
    (method: DeliveryMethod) => {
      if (method === "express") return EXPRESS_SHIPPING;
      if (subtotal === 0) return 0;
      return subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    },
    [subtotal, discount],
  );

  const shipping = shippingFor("standard");
  const total = Math.max(0, subtotal - discount + shipping);
  const freeShippingGap = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - (subtotal - discount),
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const c = findCoupon(code);
      if (!c) {
        toast({
          title: "That code did not work",
          description: "Check the spelling and try again.",
          tone: "error",
        });
        return false;
      }
      if (subtotal < c.minOrder) {
        toast({
          title: `${c.code} needs a minimum order`,
          description: `Add ₹${(c.minOrder - subtotal).toLocaleString("en-IN")} more to use this code.`,
          tone: "error",
        });
        return false;
      }
      setCouponCode(c.code);
      toast({
        title: `${c.code} applied`,
        description: c.description,
        tone: "success",
      });
      return true;
    },
    [subtotal, toast],
  );

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  /* -- wishlist ---------------------------------------------------------- */
  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWish = useCallback(
    (id: string) => {
      const product = PRODUCTS.find((p) => p.id === id);
      setWishlist((cur) => {
        const next = cur.includes(id)
          ? cur.filter((x) => x !== id)
          : [...cur, id];
        toast(
          cur.includes(id)
            ? { title: "Removed from wishlist" }
            : {
                title: "Saved to wishlist",
                description: product?.name,
                tone: "success",
                href: "/wishlist",
                hrefLabel: "View wishlist",
              },
        );
        return next;
      });
    },
    [toast],
  );

  /* -- orders ------------------------------------------------------------ */
  const getOrder = useCallback(
    (id: string) =>
      orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase()),
    [orders],
  );

  const placeOrder = useCallback<StoreValue["placeOrder"]>(
    ({ address, paymentMethod, deliveryMethod }) => {
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const seq = String(
        orders.filter((o) => o.id.startsWith(`GD${stamp}`)).length + 1,
      ).padStart(3, "0");
      const id = `GD${stamp}${seq}`;

      const ship = shippingFor(deliveryMethod);
      const orderTotal = Math.max(0, subtotal - discount + ship);
      const eta = new Date(now);
      eta.setDate(eta.getDate() + (deliveryMethod === "express" ? 2 : 4));

      const status: OrderStatus =
        paymentMethod === "cod" ? "confirmed" : "payment_confirmed";

      const order: Order = {
        id,
        customerId: DEMO_CUSTOMER_ID,
        customer: address,
        items: lines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          gujaratiName: l.product.gujaratiName,
          image: l.image,
          size: l.size,
          variant: l.variant,
          qty: l.qty,
          price: l.unitPrice,
        })),
        subtotal,
        discount,
        shipping: ship,
        total: orderTotal,
        couponCode: coupon?.code,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        deliveryMethod,
        status,
        courier: "Mock Express",
        trackingNumber:
          "MG" + String(Math.floor(100000000 + Math.random() * 899999999)),
        placedAt: now.toISOString(),
        estimatedDelivery: eta.toISOString(),
        timeline: TRACKING_FLOW.slice(0, TRACKING_FLOW.indexOf(status) + 1).map(
          (s, i) => ({
            status: s,
            at: new Date(now.getTime() + i * 90_000).toISOString(),
            note: STEP_NOTE[s],
          }),
        ),
      };

      setOrders((cur) => [order, ...cur]);
      setCart([]);
      setCouponCode(null);
      return order;
    },
    [orders, lines, subtotal, discount, coupon, shippingFor],
  );

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((cur) =>
        cur.map((o) => {
          if (o.id !== id) return o;
          const timeline =
            status === "cancelled"
              ? [
                  ...o.timeline.filter((t) => t.status !== "cancelled"),
                  {
                    status,
                    at: new Date().toISOString(),
                    note: STEP_NOTE.cancelled,
                  },
                ]
              : buildTimelineFrom(o, status);
          return {
            ...o,
            status,
            paymentStatus:
              status === "cancelled"
                ? "refunded"
                : status === "delivered" && o.paymentMethod === "cod"
                  ? "paid"
                  : o.paymentStatus,
            timeline,
          };
        }),
      );
      toast({
        title: "Order status updated",
        description: `${id} → ${status.replace(/_/g, " ")}`,
        tone: "success",
      });
    },
    [toast],
  );

  const myOrders = useMemo(
    () => orders.filter((o) => o.customerId === DEMO_CUSTOMER_ID),
    [orders],
  );

  /* -- searches ---------------------------------------------------------- */
  const pushSearch = useCallback((q: string) => {
    const v = q.trim();
    if (v.length < 2) return;
    setRecentSearches((cur) => [v, ...cur.filter((x) => x !== v)].slice(0, 6));
  }, []);
  const clearSearches = useCallback(() => setRecentSearches([]), []);

  const value: StoreValue = {
    hydrated,
    lines,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    freeShippingGap,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    applyCoupon,
    removeCoupon,
    shippingFor,
    wishlist,
    isWished,
    toggleWish,
    orders,
    getOrder,
    placeOrder,
    setOrderStatus,
    myOrders,
    recentSearches,
    pushSearch,
    clearSearches,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    toasts,
    toast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * Keep the timestamps already recorded, and fill in any newly-passed steps
 * with times spread between the last known event and now.
 */
function buildTimelineFrom(order: Order, status: OrderStatus) {
  const target = TRACKING_FLOW.indexOf(status);
  const known = new Map(order.timeline.map((t) => [t.status, t]));
  const fresh = buildTimeline(order.placedAt, status);
  return TRACKING_FLOW.slice(0, target + 1).map((s, i) => {
    const existing = known.get(s);
    if (existing) return existing;
    return fresh[i] ?? { status: s, at: new Date().toISOString(), note: STEP_NOTE[s] };
  });
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
