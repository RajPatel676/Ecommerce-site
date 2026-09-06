"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button-variants";
import { SIZES } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

export default function FaqPage() {
  const t = useT();
  const f = t.faq.items;

  const paras = (lines: string[]) => (
    <div className="space-y-3">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );

  const bullets = (lines: string[]) => (
    <ul className="space-y-2">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );

  const items = [
    { id: "what", title: f.what.q, content: paras(f.what.a) },
    { id: "handmade", title: f.handmade.q, content: paras(f.handmade.a) },
    { id: "material", title: f.material.q, content: paras(f.material.a) },
    {
      id: "size",
      title: f.size.q,
      content: (
        <div className="space-y-4">
          <p>{f.size.a[0]}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-[0.85rem]">
              <thead>
                <tr className="border-b border-cream-400 text-left text-clay-300">
                  <th className="py-2 font-medium">{t.faq.sizeTable.size}</th>
                  <th className="py-2 font-medium">{t.faq.sizeTable.godadi}</th>
                  <th className="py-2 font-medium">{t.faq.sizeTable.suits}</th>
                </tr>
              </thead>
              <tbody className="text-clay-500">
                {(["single", "double", "king"] as const).map((k, i, arr) => (
                  <tr
                    key={k}
                    className={i < arr.length - 1 ? "border-b border-cream-400" : ""}
                  >
                    <td className="py-2.5 font-medium">{t.sizes[k]}</td>
                    <td className="py-2.5">{SIZES[k].dimensions}</td>
                    <td className="py-2.5">{t.faq.sizeSuits[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-clay-300">{f.size.a[1]}</p>
        </div>
      ),
    },
    { id: "cod", title: f.cod.q, content: paras(f.cod.a) },
    { id: "shipping", title: f.shipping.q, content: bullets(f.shipping.a) },
    { id: "returns", title: f.returns.q, content: paras(f.returns.a) },
    { id: "track", title: f.track.q, content: paras(f.track.a) },
    { id: "care", title: f.care.q, content: bullets(f.care.a) },
  ];

  return (
    <>
      <section className="border-b border-cream-400 bg-cream-200 py-12 weave lg:py-16">
        <div className="container">
          <SectionHeading
            align="left"
            kicker={t.faq.kicker}
            title={t.faq.title}
            gujarati={t.faq.titleGu}
            description={t.faq.desc}
          />
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div id="shipping" className="scroll-mt-24">
            <div id="returns" className="scroll-mt-24" />
            <div id="care" className="scroll-mt-24" />
            <Accordion
              items={items}
              defaultOpen={["what"]}
              allowMultiple
              className="border-y border-cream-400"
            />
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <div className="card-surface p-5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream-300 text-terracotta-500">
                <MessageCircle className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-[1.15rem] text-clay-600">
                {t.faq.stillHave}
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-clay-300">
                {t.faq.stillHaveDesc}
              </p>
              <Link
                href="/contact"
                className={cn(buttonVariants({ full: true }), "mt-4")}
              >
                {t.faq.contactUs}
              </Link>
              <Link
                href="/track"
                className={cn(
                  buttonVariants({ variant: "ghost", full: true, size: "sm" }),
                  "mt-2",
                )}
              >
                {t.faq.trackAnOrder}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
