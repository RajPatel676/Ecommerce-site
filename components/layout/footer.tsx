"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Heart } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";

const columns = (t: Dict) => [
  {
    title: t.footer.shop,
    links: [
      { label: t.footer.allGodadi, href: "/shop" },
      { label: t.footer.singleBed, href: "/shop?category=single" },
      { label: t.footer.doubleBed, href: "/shop?category=double" },
      { label: t.footer.babyGodadi, href: "/shop?category=baby" },
      { label: t.footer.premium, href: "/shop?category=premium" },
    ],
  },
  {
    title: t.footer.about,
    links: [
      { label: t.footer.ourStory, href: "/about" },
      { label: t.footer.craftsmanship, href: "/about#craft" },
      { label: t.nav.contact, href: "/contact" },
      { label: t.footer.faq, href: "/faq" },
    ],
  },
  {
    title: t.footer.care,
    links: [
      { label: t.footer.shipping, href: "/faq#shipping" },
      { label: t.footer.returns, href: "/faq#returns" },
      { label: t.footer.trackOrder, href: "/track" },
      { label: t.footer.careGuide, href: "/faq#care" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "/contact", icon: Instagram },
  { label: "Facebook", href: "/contact", icon: Facebook },
  { label: "WhatsApp", href: "/contact", icon: MessageCircle },
];

export function Footer() {
  const t = useT();
  const COLUMNS = columns(t);

  return (
    <footer className="mt-24 border-t border-cream-400 bg-cream-200 weave">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 font-gujarati text-[0.95rem] leading-relaxed text-terracotta-400">
              {t.footer.tagline}
            </p>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-clay-300">
              {t.footer.blurb}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="kicker mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.88rem] text-clay-400 transition-colors hover:text-terracotta-500"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="kicker mb-4">{t.footer.follow}</h3>
            <ul className="space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-2.5 text-[0.88rem] text-clay-400 transition-colors hover:text-terracotta-500"
                  >
                    <s.icon className="h-4 w-4" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.78rem] leading-relaxed text-clay-300">
              Vadodara, Gujarat
              <br />
              {t.footer.hours}
            </p>
          </div>
        </div>

        <div className="stitch-line my-10 text-cream-500" aria-hidden />

        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.78rem] text-clay-300">
            {t.footer.rights}
          </p>
          <p className="flex items-center gap-1.5 text-[0.78rem] text-clay-300">
            {t.footer.madeWith}
            <Heart className="h-3.5 w-3.5 fill-terracotta-400 text-terracotta-400" />
            {t.footer.inGujarat}
          </p>
          <p className="text-[0.72rem] text-clay-200">
            {t.footer.prototype}
          </p>
        </div>
      </div>
    </footer>
  );
}
