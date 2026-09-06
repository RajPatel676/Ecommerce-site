"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeIndianRupee,
  CreditCard,
  Lock,
  Package,
  ShoppingBag,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import type { Address, DeliveryMethod, PaymentMethod } from "@/lib/types";
import { cn, inr } from "@/lib/utils";
import { EXPRESS_SHIPPING } from "@/lib/data/orders";

const STATES = [
  "Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Karnataka",
  "Tamil Nadu", "Delhi", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala", "Punjab",
];

const EMPTY: Address = {
  name: "", phone: "", email: "", house: "", street: "",
  city: "", state: "Gujarat", pincode: "",
};

type Errors = Partial<Record<keyof Address, string>>;

export function CheckoutClient() {
  const { hydrated, lines, subtotal, discount, coupon, shippingFor, placeOrder, cartCount } =
    useStore();
  const router = useRouter();

  const [address, setAddress] = useState<Address>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [processing, setProcessing] = useState(false);

  const shipping = shippingFor(delivery);
  const total = Math.max(0, subtotal - discount + shipping);

  const set = (k: keyof Address, v: string) => {
    setAddress((a) => ({ ...a, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (address.name.trim().length < 2) e.name = "Please tell us your name.";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(address.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address.email))
      e.email = "Enter a valid email address.";
    if (address.house.trim().length < 2) e.house = "House or flat number is needed.";
    if (address.street.trim().length < 3) e.street = "Street or area is needed.";
    if (address.city.trim().length < 2) e.city = "Which city?";
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = "Pincode must be 6 digits.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = async () => {
    if (!validate()) {
      document
        .querySelector("[data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setProcessing(true);
    // Simulated gateway round-trip — nothing leaves the browser.
    await new Promise((r) => setTimeout(r, 1600));
    const order = placeOrder({ address, paymentMethod: payment, deliveryMethod: delivery });
    router.push(`/order-confirmation/${order.id}`);
  };

  if (hydrated && lines.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={ShoppingBag}
          title="There is nothing to check out yet."
          description="Add a godadi to your cart and this page will fill itself in."
          actionLabel="Explore Godadi"
          actionHref="/shop"
          className="rounded-3xl border border-dashed border-cream-500 bg-cream-200"
        />
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-[1.9rem] leading-tight text-clay-600 sm:text-[2.3rem]">
          Checkout
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] text-clay-300">
          <Lock className="h-3.5 w-3.5" />
          Prototype checkout — no real payment is processed.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:gap-12">
        {/* ------------------------------------------------------------ form */}
        <div className="space-y-8">
          <Section step={1} title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" required error={errors.name} className="sm:col-span-2">
                <div data-invalid={!!errors.name}>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={address.name}
                    invalid={!!errors.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Hardik Patel"
                  />
                </div>
              </Field>
              <Field label="Mobile number" htmlFor="phone" required error={errors.phone}>
                <div data-invalid={!!errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={address.phone}
                    invalid={!!errors.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="98250 41133"
                  />
                </div>
              </Field>
              <Field label="Email" htmlFor="email" required error={errors.email}>
                <div data-invalid={!!errors.email}>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={address.email}
                    invalid={!!errors.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.in"
                  />
                </div>
              </Field>
            </div>
          </Section>

          <Section step={2} title="Delivery Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="House / Flat" htmlFor="house" required error={errors.house}>
                <div data-invalid={!!errors.house}>
                  <Input
                    id="house"
                    value={address.house}
                    invalid={!!errors.house}
                    onChange={(e) => set("house", e.target.value)}
                    placeholder="B-402, Shreeji Residency"
                  />
                </div>
              </Field>
              <Field label="Street / Area" htmlFor="street" required error={errors.street}>
                <div data-invalid={!!errors.street}>
                  <Input
                    id="street"
                    value={address.street}
                    invalid={!!errors.street}
                    onChange={(e) => set("street", e.target.value)}
                    placeholder="Gotri Road"
                  />
                </div>
              </Field>
              <Field label="City" htmlFor="city" required error={errors.city}>
                <div data-invalid={!!errors.city}>
                  <Input
                    id="city"
                    value={address.city}
                    invalid={!!errors.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Vadodara"
                  />
                </div>
              </Field>
              <Field label="State" htmlFor="state" required>
                <select
                  id="state"
                  value={address.state}
                  onChange={(e) => set("state", e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-cream-500 bg-card px-4 text-sm text-ink focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-200/70"
                >
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pincode" htmlFor="pincode" required error={errors.pincode}>
                <div data-invalid={!!errors.pincode}>
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={address.pincode}
                    invalid={!!errors.pincode}
                    onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
                    placeholder="390021"
                  />
                </div>
              </Field>
            </div>
          </Section>

          <Section step={3} title="Delivery Method">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                selected={delivery === "standard"}
                onSelect={() => setDelivery("standard")}
                icon={Truck}
                title="Standard Delivery"
                subtitle="4–6 working days"
                right={
                  shippingFor("standard") === 0 ? (
                    <span className="text-leaf-400">Free</span>
                  ) : (
                    inr(shippingFor("standard"))
                  )
                }
                name="delivery"
              />
              <Choice
                selected={delivery === "express"}
                onSelect={() => setDelivery("express")}
                icon={Zap}
                title="Express Delivery"
                subtitle="2–3 working days"
                right={inr(EXPRESS_SHIPPING)}
                name="delivery"
              />
            </div>
          </Section>

          <Section step={4} title="Payment Method">
            <div className="space-y-3">
              <Choice
                selected={payment === "upi"}
                onSelect={() => setPayment("upi")}
                icon={Smartphone}
                title="UPI"
                subtitle="GPay, PhonePe, Paytm and every UPI app"
                name="payment"
              />
              <Choice
                selected={payment === "card"}
                onSelect={() => setPayment("card")}
                icon={CreditCard}
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, RuPay, Amex"
                name="payment"
              />
              <Choice
                selected={payment === "cod"}
                onSelect={() => setPayment("cod")}
                icon={BadgeIndianRupee}
                title="Cash on Delivery"
                subtitle="Pay the delivery partner when it arrives"
                name="payment"
              />
            </div>

            {payment === "upi" && (
              <div className="mt-4 animate-fade-in rounded-xl border border-cream-500 bg-cream-200 p-4">
                <Field label="UPI ID" htmlFor="upi" hint="Any value works — this is a prototype.">
                  <Input id="upi" placeholder="yourname@okhdfcbank" />
                </Field>
              </div>
            )}
            {payment === "card" && (
              <div className="mt-4 grid animate-fade-in gap-4 rounded-xl border border-cream-500 bg-cream-200 p-4 sm:grid-cols-2">
                <Field label="Card number" htmlFor="cardno" className="sm:col-span-2">
                  <Input id="cardno" inputMode="numeric" placeholder="4111 1111 1111 1111" />
                </Field>
                <Field label="Expiry" htmlFor="exp">
                  <Input id="exp" placeholder="MM / YY" />
                </Field>
                <Field label="CVV" htmlFor="cvv">
                  <Input id="cvv" inputMode="numeric" maxLength={4} placeholder="•••" />
                </Field>
                <p className="text-[0.72rem] text-clay-300 sm:col-span-2">
                  Nothing is transmitted anywhere — the form is a mock.
                </p>
              </div>
            )}
            {payment === "cod" && (
              <p className="mt-4 animate-fade-in rounded-xl border border-mustard-200 bg-mustard-50 p-4 text-[0.82rem] text-clay-500">
                Keep {inr(total)} ready. Our delivery partner accepts cash and UPI at
                the door.
              </p>
            )}
          </Section>
        </div>

        {/* --------------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl text-clay-600">Your Order</h2>
              <Link
                href="/cart"
                className="text-[0.78rem] text-terracotta-500 hover:underline"
              >
                Edit
              </Link>
            </div>

            <ul className="mt-4 max-h-72 space-y-3.5 overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-cream-400">
                    <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-inverse text-[0.62rem] font-bold text-on-inverse">
                      {l.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.85rem] font-medium text-clay-600">
                      {l.product.name}
                    </p>
                    <p className="text-[0.72rem] text-clay-300">
                      {l.sizeLabel} · {l.variantLabel}
                    </p>
                  </div>
                  <p className="text-[0.85rem] font-semibold text-clay-600">
                    {inr(l.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-cream-400 pt-4 text-[0.86rem]">
              <div className="flex justify-between text-clay-400">
                <dt>Subtotal ({cartCount})</dt>
                <dd className="tabular-nums">{inr(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf-400">
                  <dt>Discount {coupon ? `(${coupon.code})` : ""}</dt>
                  <dd className="tabular-nums">−{inr(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-clay-400">
                <dt>Shipping</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? <span className="text-leaf-400">Free</span> : inr(shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-cream-400 pt-3.5 text-lg font-semibold text-clay-600">
                <dt>Total</dt>
                <dd className="tabular-nums">{inr(total)}</dd>
              </div>
            </dl>

            <Button
              size="lg"
              full
              className="mt-5"
              loading={processing}
              onClick={pay}
            >
              {processing
                ? "Processing payment…"
                : payment === "cod"
                  ? `Place Order · ${inr(total)}`
                  : `Pay Now · ${inr(total)}`}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.72rem] text-clay-300">
              <Package className="h-3.5 w-3.5" />
              Wrapped in muslin, dispatched from Vadodara
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 font-display text-xl text-clay-600">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-terracotta-500 text-[0.78rem] font-bold text-on-accent">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Choice({
  selected,
  onSelect,
  icon: Icon,
  title,
  subtitle,
  right,
  name,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all",
        selected
          ? "border-terracotta-400 bg-terracotta-50 ring-1 ring-terracotta-300"
          : "border-cream-500 bg-card hover:border-clay-200",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-full",
          selected ? "bg-terracotta-500 text-on-accent" : "bg-cream-300 text-clay-400",
        )}
      >
        <Icon className="h-[1.1rem] w-[1.1rem]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.92rem] font-medium text-clay-600">{title}</span>
        <span className="block text-[0.76rem] leading-snug text-clay-300">
          {subtitle}
        </span>
      </span>
      {right && (
        <span className="shrink-0 text-[0.85rem] font-semibold text-clay-500">
          {right}
        </span>
      )}
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          selected ? "border-terracotta-500" : "border-cream-500",
        )}
        aria-hidden
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-terracotta-500" />}
      </span>
    </label>
  );
}
