"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

const IMAGES = {
  beginning: { src: "/img/about-hero.webp", alt: "A godadi laid across a bed in a warm Gujarati home" },
  craft: { src: "/img/artisan.webp", alt: "Hands quilting a godadi with a needle and thread", reverse: true },
  people: { src: "/img/people.webp", alt: "An artisan's workspace with thread and fabric" },
  why: { src: "/img/craft.webp", alt: "Folded godadis stacked on a surface", reverse: true },
} as const;

const ORDER = ["beginning", "craft", "people", "why"] as const;

export default function AboutPage() {
  const t = useT();

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[52vh] min-h-[22rem] w-full">
          <Image
            src="/img/about-hero.webp"
            alt={t.about.heroTitle}
            fill
            priority
            sizes="100vw"
            className="img-editorial object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse/80 via-inverse/35 to-inverse/10" />
        </div>
        <div className="container relative -mt-32 pb-4">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mustard-200">
              {t.about.heroKicker}
            </p>
            <h1 className="mt-3 text-[2rem] leading-tight text-on-inverse sm:text-[2.8rem]">
              {t.about.heroTitle}
            </h1>
            <p className="mt-4 text-[1rem] text-on-inverse-muted">
              {t.about.heroGu}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- chapters */}
      <div className="container">
        {ORDER.map((key) => {
          const c = t.about.chapters[key];
          const img = IMAGES[key];
          const reverse = "reverse" in img && img.reverse;
          return (
            <section
              key={key}
              id={key}
              className="grid scroll-mt-24 items-center gap-8 border-b border-cream-400 py-14 last:border-0 lg:grid-cols-2 lg:gap-16 lg:py-20"
            >
              <div
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-3xl border border-cream-400",
                  reverse && "lg:order-2",
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className={cn(reverse && "lg:order-1")}>
                <p className="kicker">{c.kicker}</p>
                <h2 className="mt-3 text-[1.6rem] leading-tight text-clay-600 sm:text-[2rem]">
                  {c.title}
                </h2>
                <p className="mt-2.5 text-[0.95rem] text-terracotta-400">
                  {c.gujarati}
                </p>
                <div className="mt-5 space-y-4 text-[0.95rem] leading-[1.75] text-clay-400">
                  {c.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* --------------------------------------------------------- promise */}
      <section id="promise" className="scroll-mt-24 bg-inverse py-16 text-on-inverse-muted lg:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mustard-200">
              {t.about.promiseKicker}
            </p>
            <h2 className="mt-3 text-[1.8rem] leading-tight text-on-inverse sm:text-[2.3rem]">
              {t.about.promiseTitle}
            </h2>
          </div>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.promises.map((p, i) => (
              <li key={p.t}>
                <p className="font-display text-3xl text-mustard-200/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="stitch-line my-4 w-12 text-on-inverse-muted/30" aria-hidden />
                <h3 className="font-display text-[1.08rem] leading-snug text-on-inverse">
                  {p.t}
                </h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-on-inverse-muted">
                  {p.d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- quote */}
      <section className="container py-16 lg:py-24">
        <figure className="mx-auto max-w-2xl text-center">
          <Quote className="mx-auto h-8 w-8 text-terracotta-200" aria-hidden />
          <blockquote className="mt-6 font-display text-[1.35rem] leading-relaxed text-clay-600 sm:text-[1.6rem]">
            {t.about.quote}
          </blockquote>
          <figcaption className="mt-6 text-[0.85rem] text-clay-300">
            <span className="font-semibold text-clay-500">{t.about.quoteName}</span> ·{" "}
            {t.about.quoteRole}
          </figcaption>
        </figure>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
            {t.about.shopCollection}
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t.about.talkToUs}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
