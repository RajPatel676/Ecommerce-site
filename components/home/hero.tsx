"use client";

import Image from "next/image";
import Link from "next/link";
import { Hand, Leaf, MapPin, RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

export function Hero() {
  const t = useT();
  const TRUST = [
    { icon: Hand, label: t.home.trust.handmade },
    { icon: Leaf, label: t.home.trust.cotton },
    { icon: MapPin, label: t.home.trust.gujarat },
    { icon: RotateCcw, label: t.home.trust.returns },
  ];

  return (
    <section className="relative overflow-hidden bg-cream-200 weave">
      <div className="container grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
        <div className="animate-fade-up">
          <p className="kicker mb-5">{t.home.kicker}</p>

          <h1 className="font-gujarati text-[2.15rem] font-semibold leading-[1.25] text-clay-600 sm:text-[2.9rem] lg:text-[3.4rem]">
            ઘરની હૂંફ,
            <br />
            હાથની મહેનત.
          </h1>

          <p className="mt-5 max-w-md font-gujarati text-[1rem] leading-relaxed text-clay-400 sm:text-[1.08rem]">
            {t.home.heroSupport}
          </p>
          <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-clay-300">
            {t.home.heroSupportEn}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
              {t.home.shopGodadi}
            </Link>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {t.home.ourStory}
            </Link>
          </div>

          <ul className="mt-10 grid max-w-lg grid-cols-2 gap-x-4 gap-y-3.5 sm:grid-cols-4 sm:gap-x-2">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5 sm:flex-col sm:gap-2 sm:text-center">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream-500 bg-cream-100 text-terracotta-400">
                  <t.icon className="h-4 w-4" />
                </span>
                <span className="text-[0.78rem] font-medium leading-tight text-clay-400">
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative aspect-[13/9] w-full overflow-hidden rounded-3xl border border-cream-500 shadow-lift">
            <Image
              src="/img/hero.webp"
              alt="A handmade Kutch patchwork godadi laid across a wooden bed in a warm Gujarati home"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 55vw"
              className="img-editorial object-cover"
            />
          </div>

          {/* floating detail card */}
          <div className="absolute -bottom-5 left-4 hidden w-56 rounded-2xl border border-cream-400 bg-cream-100/95 p-4 shadow-lift backdrop-blur sm:block lg:-left-8">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <Image src="/img/texture-1.webp" alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.14em] text-clay-300">
                  {t.home.handQuilted}
                </p>
                <p className="font-display text-[0.95rem] text-clay-600">
                  {t.home.stitchesPerInch}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
