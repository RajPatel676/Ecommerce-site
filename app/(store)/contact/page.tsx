"use client";

import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/ui/misc";
import { useT } from "@/components/i18n/language-provider";
import type { Dict } from "@/lib/i18n";

const channels = (t: Dict) => [
  {
    icon: MessageCircle,
    label: t.contact.whatsapp,
    value: "+91 99046 22871",
    note: t.contact.whatsappNote,
    href: "/contact",
  },
  {
    icon: Phone,
    label: t.contact.phoneLabel,
    value: "+91 265 246 8890",
    note: t.contact.phoneNote,
    href: "/contact",
  },
  {
    icon: Mail,
    label: t.contact.emailLabel,
    value: "hello@hansabengodadi.in",
    note: t.contact.emailNote,
    href: "/contact",
  },
];

const HOURS = [
  { d: "Mon – Fri", h: "10:00 – 19:00" },
  { d: "Sat", h: "10:00 – 16:00" },
  { d: "Sun", h: "—" },
];

export default function ContactPage() {
  const t = useT();
  const CHANNELS = channels(t);

  return (
    <>
      <section className="border-b border-cream-400 bg-cream-200 py-12 weave lg:py-16">
        <div className="container">
          <SectionHeading
            align="left"
            kicker={t.contact.kicker}
            title={t.contact.title}
            gujarati={t.contact.titleGu}
            description={t.contact.desc}
          />
        </div>
      </section>

      <div className="container py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* form */}
          <div>
            <h2 className="mb-6 font-display text-2xl text-clay-600">
              {t.contact.sendMessage}
            </h2>
            <ContactForm />
          </div>

          {/* channels */}
          <aside className="space-y-5">
            <ul className="space-y-3">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="card-surface flex items-start gap-4 p-4 transition-shadow hover:shadow-lift"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-300 text-terracotta-500">
                      <c.icon className="h-[1.15rem] w-[1.15rem]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] uppercase tracking-[0.14em] text-clay-300">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block text-[0.95rem] font-medium text-clay-600">
                        {c.value}
                      </span>
                      <span className="mt-0.5 block text-[0.78rem] text-clay-300">
                        {c.note}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="card-surface p-5">
              <h3 className="flex items-center gap-2 font-display text-[1.05rem] text-clay-600">
                <MapPin className="h-4 w-4 text-terracotta-400" />
                {t.contact.workshop}
              </h3>
              <address className="mt-3 not-italic text-[0.88rem] leading-relaxed text-clay-400">
                Hansaben Godadi
                <br />
                3rd Floor, Aarya Corporate
                <br />
                Alkapuri, Vadodara 390007
                <br />
                Gujarat, India
              </address>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-clay-300">
                {t.contact.visitNote}
              </p>
            </div>

            <div className="card-surface p-5">
              <h3 className="flex items-center gap-2 font-display text-[1.05rem] text-clay-600">
                <Clock className="h-4 w-4 text-terracotta-400" />
                {t.contact.hours}
              </h3>
              <dl className="mt-3 space-y-2 text-[0.86rem]">
                {HOURS.map((h) => (
                  <div key={h.d} className="flex justify-between gap-3">
                    <dt className="text-clay-300">{h.d}</dt>
                    <dd className="font-medium text-clay-500">{h.h}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card-surface p-5">
              <h3 className="font-display text-[1.05rem] text-clay-600">{t.contact.followUs}</h3>
              <div className="mt-3 flex gap-2.5">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: MessageCircle, label: "WhatsApp" },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href="/contact"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-cream-500 text-clay-400 transition-colors hover:border-terracotta-300 hover:bg-terracotta-50 hover:text-terracotta-500"
                  >
                    <s.icon className="h-[1.1rem] w-[1.1rem]" />
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-[0.72rem] text-clay-300">
                {t.contact.socialNote}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
