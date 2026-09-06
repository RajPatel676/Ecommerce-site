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
import { useT } from "@/components/i18n/language-provider";
import { productName } from "@/lib/i18n/content";

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
  const t = useT();

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
    if (address.name.trim().length < 2) e.name = t.checkout.errors.name;
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(address.phone.replace(/\s/g, "")))
      e.phone = t.checkout.errors.phone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address.email))
      e.email = t.checkout.errors.email;
    if (address.house.trim().length < 2) e.house = t.checkout.errors.house;
    if (address.street.trim().length < 3) e.street = t.checkout.errors.street;
    if (address.city.trim().length < 2) e.city = t.checkout.errors.city;
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = t.checkout.errors.pincode;
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
          title={t.checkout.emptyTitle}
          description={t.checkout.emptyDesc}
          actionLabel={t.common.exploreGodadi}
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
          {t.checkout.title}
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] text-clay-300">
          <Lock className="h-3.5 w-3.5" />
          {t.checkout.note}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:gap-12">
        {/* ------------------------------------------------------------ form */}
        <div className="space-y-8">
          <Section step={1} title={t.checkout.contact}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.checkout.fullName} htmlFor="name" required error={errors.name} className="sm:col-span-2">
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
              <Field label={t.checkout.mobile} htmlFor="phone" required error={errors.phone}>
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
              <Field label={t.checkout.email} htmlFor="email" required error={errors.email}>
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

          <Section step={2} title={t.checkout.address}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.checkout.house} htmlFor="house" required error={errors.house}>
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
              <Field label={t.checkout.street} htmlFor="street" required error={errors.street}>
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
              <Field label={t.checkout.city} htmlFor="city" required error={errors.city}>
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
              <Field label={t.checkout.state} htmlFor="state" required>
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
              <Field label={t.checkout.pincode} htmlFor="pincode" required error={errors.pincode}>
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

          <Section step={3} title={t.checkout.deliveryMethod}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                selected={delivery === "standard"}
                onSelect={() => setDelivery("standard")}
                icon={Truck}
                title={t.checkout.standard}
                subtitle={t.checkout.standardDays}
                right={
                  shippingFor("standard") === 0 ? (
                    <span className="text-leaf-400">{t.common.free}</span>
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
                title={t.checkout.express}
                subtitle={t.checkout.expressDays}
                right={inr(EXPRESS_SHIPPING)}
                name="delivery"
              />
            </div>
          </Section>

          <Section step={4} title={t.checkout.paymentMethod}>
            <div className="space-y-3">
              <Choice
                selected={payment === "upi"}
                onSelect={() => setPayment("upi")}
                icon={Smartphone}
                title={t.checkout.upi}
                subtitle={t.checkout.upiSub}
                name="payment"
              />
              <Choice
                selected={payment === "card"}
                onSelect={() => setPayment("card")}
                icon={CreditCard}
                title={t.checkout.card}
                subtitle={t.checkout.cardSub}
                name="payment"
              />
              <Choice
                selected={payment === "cod"}
                onSelect={() => setPayment("cod")}
                icon={BadgeIndianRupee}
                title={t.checkout.cod}
                subtitle={t.checkout.codSub}
                name="payment"
              />
            </div>

            {payment === "upi" && (
              <div className="mt-4 animate-fade-in rounded-xl border border-cream-500 bg-cream-200 p-4">
                <Field label={t.checkout.upiId} htmlFor="upi" hint={t.checkout.upiHint}>
                  <Input id="upi" placeholder="yourname@okhdfcbank" />
                </Field>
              </div>
            )}
            {payment === "card" && (
              <div className="mt-4 grid animate-fade-in gap-4 rounded-xl border border-cream-500 bg-cream-200 p-4 sm:grid-cols-2">
                <Field label={t.checkout.cardNumber} htmlFor="cardno" className="sm:col-span-2">
                  <Input id="cardno" inputMode="numeric" placeholder="4111 1111 1111 1111" />
                </Field>
                <Field label={t.checkout.expiry} htmlFor="exp">
                  <Input id="exp" placeholder="MM / YY" />
                </Field>
                <Field label={t.checkout.cvv} htmlFor="cvv">
                  <Input id="cvv" inputMode="numeric" maxLength={4} placeholder="•••" />
                </Field>
                <p className="text-[0.72rem] text-clay-300 sm:col-span-2">
                  {t.checkout.cardNote}
                </p>
              </div>
            )}
            {payment === "cod" && (
              <p className="mt-4 animate-fade-in rounded-xl border border-mustard-200 bg-mustard-50 p-4 text-[0.82rem] text-clay-500">
                {t.checkout.codNote(inr(total))}
              </p>
            )}
          </Section>
        </div>

        {/* --------------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl text-clay-600">{t.checkout.yourOrder}</h2>
              <Link
                href="/cart"
                className="text-[0.78rem] text-terracotta-500 hover:underline"
              >
                {t.common.edit}
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
                      {productName(l.product, t)}
                    </p>
                    <p className="text-[0.72rem] text-clay-300">
                      {t.sizes[l.size]} · {l.variantLabel}
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
                <dt>{t.cart.subtotal} ({cartCount})</dt>
                <dd className="tabular-nums">{inr(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf-400">
                  <dt>{t.cart.discount} {coupon ? `(${coupon.code})` : ""}</dt>
                  <dd className="tabular-nums">−{inr(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-clay-400">
                <dt>{t.cart.shipping}</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? <span className="text-leaf-400">{t.common.free}</span> : inr(shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-cream-400 pt-3.5 text-lg font-semibold text-clay-600">
                <dt>{t.cart.total}</dt>
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
                ? t.checkout.processing
                : payment === "cod"
                  ? `${t.checkout.placeOrder} · ${inr(total)}`
                  : `${t.checkout.payNow} · ${inr(total)}`}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.72rem] text-clay-300">
              <Package className="h-3.5 w-3.5" />
              {t.checkout.wrapped}
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
