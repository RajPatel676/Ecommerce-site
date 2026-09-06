"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hand, Heart, Leaf, MapPin, Quote } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button-variants";
import { CATEGORIES, featuredProducts } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";
import { categoryBlurb, categoryName } from "@/lib/i18n/content";
import type { Dict } from "@/lib/i18n";

const why = (t: Dict) => [
  { icon: Hand, ...t.home.why.handmade },
  { icon: Leaf, ...t.home.why.cotton },
  { icon: MapPin, ...t.home.why.gujarat },
  { icon: Heart, ...t.home.why.love },
];

const REVIEWS = [
  {
    quote:
      "It came folded in muslin with a handwritten note. My mother recognised the stitch immediately — she said her mother made them the same way.",
    name: "Nirali S.",
    city: "Ahmedabad",
  },
  {
    quote:
      "I have washed it eight times now and it has only got softer. Worth every rupee.",
    name: "Jignesh V.",
    city: "Bhuj",
  },
  {
    quote:
      "Bought the baby godadi as a gift. The cotton is genuinely soft, not the stiff kind you get in stores.",
    name: "Pooja M.",
    city: "Pune",
  },
];

export default function HomePage() {
  const t = useT();
  const featured = featuredProducts();
  const WHY = why(t);

  return (
    <>
      <Hero />

      {/* ------------------------------------------------------- categories */}
      <section className="container py-16 lg:py-24">
        <SectionHeading
          kicker={t.home.categoriesKicker}
          title={t.home.categoriesTitle}
          gujarati={t.home.categoriesGu}
          description={t.home.categoriesDesc}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.key}
              href={`/shop?category=${c.key}`}
              className="group relative overflow-hidden rounded-2xl border border-cream-400 bg-cream-200"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={c.image}
                  alt={categoryName(c, t)}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  priority={i < 3}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse/95 via-inverse/65 to-inverse/5" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                <h3 className="font-display text-[1.05rem] leading-tight text-on-inverse lg:text-[1.2rem]">
                  {categoryName(c, t)}
                </h3>
                <p className="mt-1 hidden text-[0.8rem] leading-snug text-on-inverse-muted sm:block">
                  {categoryBlurb(c, t)}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-mustard-200 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  {t.common.shopNow} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- featured */}
      <section className="border-y border-cream-400 bg-cream-200 py-16 weave lg:py-24">
        <div className="container">
          <SectionHeading
            align="left"
            kicker={t.home.featuredKicker}
            title={t.home.featuredTitle}
            gujarati={t.home.featuredGu}
            action={
              <Link
                href="/shop"
                className="group inline-flex shrink-0 items-center gap-2 text-[0.88rem] font-medium text-terracotta-500"
              >
                {t.common.viewAll}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:gap-x-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- why us */}
      <section className="container py-16 lg:py-24">
        <SectionHeading
          kicker={t.home.whyKicker}
          title={t.home.whyTitle}
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {WHY.map((w) => (
            <div key={w.title}>
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-cream-500 bg-cream-200 text-terracotta-400">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-[1.1rem] text-clay-600">{w.title}</h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-clay-300">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- brand story */}
      <section className="border-y border-cream-400 bg-inverse text-on-inverse-muted">
        <div className="container grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl lg:aspect-[6/5]">
            <Image
              src="/img/artisan.webp"
              alt="Hands quilting a godadi with a running stitch"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="img-editorial object-cover"
            />
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mustard-200">
              {t.home.storyKicker}
            </p>
            <h2 className="mt-3 text-[1.9rem] leading-tight text-on-inverse sm:text-[2.4rem]">
              {t.home.storyTitle}
            </h2>
            <p className="mt-6 font-gujarati text-[1.02rem] leading-[1.9] text-on-inverse-muted/90">
              {t.home.storyGu}
            </p>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-on-inverse-muted/70">
              {t.home.storyBody}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 border-b border-mustard-200/50 pb-1 text-[0.92rem] font-medium text-mustard-200"
            >
              {t.common.readOurStory}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- reviews */}
      <section className="container py-16 lg:py-24">
        <SectionHeading
          kicker={t.home.reviewsKicker}
          title={t.home.reviewsTitle}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="card-surface flex flex-col p-6 transition-shadow hover:shadow-lift"
            >
              <Quote className="h-6 w-6 text-terracotta-200" aria-hidden />
              <blockquote className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-clay-500">
                {r.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-cream-400 pt-4 text-[0.8rem] text-clay-300">
                <span className="font-semibold text-clay-500">{r.name}</span> ·{" "}
                {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="container pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-cream-400">
          <Image
            src="/img/fabric.webp"
            alt=""
            fill
            sizes="100vw"
            className="img-editorial object-cover"
          />
          <div className="relative bg-cream-100/85 px-6 py-14 text-center backdrop-blur-[2px] sm:px-12">
            <h2 className="text-[1.7rem] leading-tight text-clay-600 sm:text-[2.1rem]">
              {t.home.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[0.92rem] leading-relaxed text-clay-400">
              {t.home.ctaBody}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/faq" className={cn(buttonVariants({ size: "lg" }))}>
                {t.home.ctaPrimary}
              </Link>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
