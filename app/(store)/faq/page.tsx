import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button-variants";
import { SIZES } from "@/lib/data/products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "What a godadi is, how ours are made, sizing, delivery, returns and washing instructions.",
};

const FAQS = [
  {
    id: "what",
    title: "What is a Godadi?",
    content: (
      <div className="space-y-3">
        <p>
          A godadi (ગોદડી) is a traditional Indian quilt — layers of cotton held
          together with a hand-run stitch. In Gujarat it has historically been made at
          home from worn clothes and old saris, which is why almost every family has
          one that is older than the children in the house.
        </p>
        <p>
          It sits between a bedsheet and a duvet: breathable enough for warm nights,
          warm enough for a cold one, and light enough to fold into a cupboard.
        </p>
      </div>
    ),
  },
  {
    id: "handmade",
    title: "Is every Godadi handmade?",
    content: (
      <p>
        Yes — every one. The blocks are cut by hand, pieced by hand, and quilted with
        a hand-run stitch. We do not machine-quilt anything, which is also why we
        make a limited number each month. Small variations in block size and stitch
        spacing are a feature of the work, not a defect.
      </p>
    ),
  },
  {
    id: "material",
    title: "What material is used?",
    content: (
      <div className="space-y-3">
        <p>
          Cotton all the way through — cotton top, cotton batting and cotton backing.
          No polyester filling, no synthetic blends.
        </p>
        <p>
          Our premium range uses long-staple cotton and a double layer of batting.
          Baby godadis use pre-washed muslin-backed cotton with azo-free dyes, washed
          twice before they ever reach you.
        </p>
      </div>
    ),
  },
  {
    id: "size",
    title: "How do I choose the right size?",
    content: (
      <div className="space-y-4">
        <p>
          Pick the size of your mattress, not the size of your room. A godadi should
          overhang the bed by about a foot on each side.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-[0.85rem]">
            <thead>
              <tr className="border-b border-cream-400 text-left text-clay-300">
                <th className="py-2 font-medium">Size</th>
                <th className="py-2 font-medium">Godadi</th>
                <th className="py-2 font-medium">Suits</th>
              </tr>
            </thead>
            <tbody className="text-clay-500">
              <tr className="border-b border-cream-400">
                <td className="py-2.5 font-medium">{SIZES.single.label}</td>
                <td className="py-2.5">{SIZES.single.dimensions}</td>
                <td className="py-2.5">Single bed, day bed, reading chair</td>
              </tr>
              <tr className="border-b border-cream-400">
                <td className="py-2.5 font-medium">{SIZES.double.label}</td>
                <td className="py-2.5">{SIZES.double.dimensions}</td>
                <td className="py-2.5">Queen and standard double beds</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">{SIZES.king.label}</td>
                <td className="py-2.5">{SIZES.king.dimensions}</td>
                <td className="py-2.5">King beds, or a generous drape on a queen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-clay-300">
          Still unsure? Message us your mattress measurements and we will tell you
          which one to take.
        </p>
      </div>
    ),
  },
  {
    id: "cod",
    title: "Do you offer Cash on Delivery?",
    content: (
      <p>
        Yes, on every pincode we serve, with no extra charge. Our delivery partner
        accepts cash or UPI at the door. We also take UPI and cards at checkout.
      </p>
    ),
  },
  {
    id: "shipping",
    title: "How long does delivery take?",
    content: (
      <ul className="space-y-2">
        <li>
          <span className="font-medium text-clay-500">Standard:</span> 4–6 working
          days. Free on orders above ₹1,499, otherwise ₹99.
        </li>
        <li>
          <span className="font-medium text-clay-500">Express:</span> 2–3 working
          days for ₹199.
        </li>
        <li>
          Orders are packed and dispatched from Vadodara within 24 hours of being
          confirmed. During Diwali and wedding season, add a day.
        </li>
      </ul>
    ),
  },
  {
    id: "returns",
    title: "Can I return my order?",
    content: (
      <div className="space-y-3">
        <p>
          Yes — seven days from delivery, unwashed and unused, in the muslin wrap it
          arrived in. We arrange a free reverse pickup wherever the courier serves.
        </p>
        <p>
          Refunds reach the original payment method in 5–7 working days. For Cash on
          Delivery orders we transfer to a bank account or UPI ID you give us.
        </p>
      </div>
    ),
  },
  {
    id: "track",
    title: "How can I track my order?",
    content: (
      <p>
        Every order gets an ID that looks like <code className="rounded bg-cream-300 px-1.5 py-0.5 font-mono text-[0.8rem]">GD20260906001</code>. Enter it on the{" "}
        <Link href="/track" className="text-terracotta-500 hover:underline">
          tracking page
        </Link>{" "}
        to see each step, from packing to your door. You will also find it under{" "}
        <Link href="/account" className="text-terracotta-500 hover:underline">
          My Orders
        </Link>
        .
      </p>
    ),
  },
  {
    id: "care",
    title: "How should I wash my Godadi?",
    content: (
      <ul className="space-y-2">
        <li>Gentle machine wash on cold, or hand wash with a mild detergent.</li>
        <li>
          No bleach. Natural and hand-dyed cottons soften a shade in the first two
          washes — that is normal.
        </li>
        <li>Line dry in shade. Direct sun will fade the colours over time.</li>
        <li>Warm iron on the reverse if you want it crisp.</li>
        <li>
          Store folded with a muslin wrap through monsoon, and air it out once a
          month.
        </li>
      </ul>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-cream-400 bg-cream-200 py-12 weave lg:py-16">
        <div className="container">
          <SectionHeading
            align="left"
            kicker="Help centre"
            title="Frequently asked questions"
            gujarati="વારંવાર પૂછાતા પ્રશ્નો"
            description="Everything we get asked most — about the craft, sizing, delivery and care."
          />
        </div>
      </section>

      <div className="container py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div id="shipping" className="scroll-mt-24">
            <div id="returns" className="scroll-mt-24" />
            <div id="care" className="scroll-mt-24" />
            <Accordion
              items={FAQS}
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
                Still have a question?
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-clay-300">
                Message the workshop directly. A person replies, usually within an
                hour during business hours.
              </p>
              <Link
                href="/contact"
                className={cn(buttonVariants({ full: true }), "mt-4")}
              >
                Contact us
              </Link>
              <Link
                href="/track"
                className={cn(
                  buttonVariants({ variant: "ghost", full: true, size: "sm" }),
                  "mt-2",
                )}
              >
                Track an order
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
