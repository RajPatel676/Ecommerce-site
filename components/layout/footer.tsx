import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Heart } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Godadi", href: "/shop" },
      { label: "Single Bed", href: "/shop?category=single" },
      { label: "Double Bed", href: "/shop?category=double" },
      { label: "Baby Godadi", href: "/shop?category=baby" },
      { label: "Premium Collection", href: "/shop?category=premium" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/about#craft" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping", href: "/faq#shipping" },
      { label: "Returns", href: "/faq#returns" },
      { label: "Track Order", href: "/track" },
      { label: "Care Guide", href: "/faq#care" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "/contact", icon: Instagram },
  { label: "Facebook", href: "/contact", icon: Facebook },
  { label: "WhatsApp", href: "/contact", icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-cream-400 bg-cream-200 weave">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 font-gujarati text-[0.95rem] leading-relaxed text-terracotta-400">
              ઘરની હૂંફ, હાથની મહેનત.
            </p>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-clay-300">
              Handcrafted warmth, made with tradition. Every godadi is pieced and
              quilted by hand in Gujarat.
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
            <h3 className="kicker mb-4">Follow Us</h3>
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
              Mon–Sat, 10am–7pm
            </p>
          </div>
        </div>

        <div className="stitch-line my-10 text-cream-500" aria-hidden />

        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.78rem] text-clay-300">
            © 2026 Vasundhara Godadi
          </p>
          <p className="flex items-center gap-1.5 text-[0.78rem] text-clay-300">
            Made with
            <Heart className="h-3.5 w-3.5 fill-terracotta-400 text-terracotta-400" />
            in Gujarat.
          </p>
          <p className="text-[0.72rem] text-clay-200">
            A design prototype · mock data only
          </p>
        </div>
      </div>
    </footer>
  );
}
