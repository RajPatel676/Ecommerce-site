import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "A little piece of Gujarat, stitched with love — how Vasundhara Godadi began, how we work, and who makes our quilts.",
};

const CHAPTERS = [
  {
    id: "beginning",
    kicker: "Our Beginning",
    title: "It started with one godadi that would not wear out.",
    gujarati: "શરૂઆત એક ગોદડીથી થઈ.",
    body: [
      "In 2019 our founder was clearing out her grandmother's house in Vadodara when she found a godadi at the bottom of a steel trunk. Thirty-one years old, washed hundreds of times, and still the softest thing in the room.",
      "Nobody in the family could remember buying it, because nobody had. It was made — from worn saris, an old dhoti, and the lining of a jacket — over four evenings in 1988.",
      "We started Vasundhara because that godadi could not be bought anywhere. Not the quality, not the weight, not the sense that someone's hands had been all over it.",
    ],
    image: "/img/about-hero.webp",
    alt: "A godadi laid across a bed in a warm Gujarati home",
  },
  {
    id: "craft",
    kicker: "Our Craft",
    title: "Cut, pieced, layered, quilted. Four days, six pairs of hands.",
    gujarati: "કાપો, જોડો, ભરો, સીવો.",
    body: [
      "Every godadi begins as a stack of cotton, cut into blocks by hand. Nothing is die-cut, which is why no two blocks in a single quilt are exactly the same size — and why the finished piece has a softness at the seams that a machine cannot reproduce.",
      "The blocks are pieced into a top, layered over cotton batting and a plain backing, then quilted with a running stitch. Our premium pieces carry nine stitches to the inch. That single line of stitching takes longer than everything else combined.",
      "The binding goes on last, folded twice and stitched down by hand around the whole perimeter. On a king size that is nearly nine metres of edge.",
    ],
    image: "/img/artisan.webp",
    alt: "Hands quilting a godadi with a needle and thread",
    reverse: true,
  },
  {
    id: "people",
    kicker: "Our People",
    title: "Twenty-two women, four workshops, one standard.",
    gujarati: "અમારા કારીગરો.",
    body: [
      "We work with four small units — in Vadodara, Bhuj, Rajkot and Godhra. Twenty-two women in total, most of whom learned to quilt at home long before it was work.",
      "Everyone is paid per piece at a rate we publish internally, and everyone works from their own home or a shared workshop within walking distance of it. Nobody commutes to us.",
      "When you buy a Heritage godadi, roughly half of what you pay goes to the people who made it. We think that is the least interesting way to be different, and the most important one.",
    ],
    image: "/img/people.webp",
    alt: "An artisan's workspace with thread and fabric",
  },
  {
    id: "why",
    kicker: "Why Godadi?",
    title: "It is the only quilt that gets better as it ages.",
    gujarati: "ગોદડી કેમ?",
    body: [
      "A godadi is not a duvet and it is not a blanket. It is a layered cotton quilt, breathable enough for a Gujarat summer and warm enough for a Kutch winter night — which is a genuinely hard thing to be.",
      "Because it is all cotton and all stitched, it softens rather than pills. Ours are tested to sixty washes. The oldest one we have in the workshop is on its fourteenth year.",
      "And it folds flat. Which matters more than people expect.",
    ],
    image: "/img/craft.webp",
    alt: "Folded godadis stacked on a surface",
    reverse: true,
  },
];

const PROMISES = [
  { n: "01", t: "Handmade, or we do not sell it", d: "No machine quilting, ever. If we cannot make it by hand, we do not put it in the collection." },
  { n: "02", t: "Cotton all the way through", d: "Top, batting and backing. No polyester filling, no synthetic blends." },
  { n: "03", t: "Fair, published piece rates", d: "Our artisans are paid per godadi at a rate we hold ourselves to." },
  { n: "04", t: "Seven days to change your mind", d: "Unwashed and unused, in the muslin it arrived in. Free reverse pickup." },
];

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[52vh] min-h-[22rem] w-full">
          <Image
            src="/img/about-hero.webp"
            alt="A handmade godadi in a warm Gujarati bedroom"
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
              Our story
            </p>
            <h1 className="mt-3 text-[2rem] leading-tight text-on-inverse sm:text-[2.8rem]">
              A little piece of Gujarat, stitched with love.
            </h1>
            <p className="mt-4 font-gujarati text-[1rem] text-on-inverse-muted/90">
              ગુજરાતનો એક નાનો ટુકડો, પ્રેમથી સીવેલો.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- chapters */}
      <div className="container">
        {CHAPTERS.map((c) => (
          <section
            key={c.id}
            id={c.id}
            className="grid scroll-mt-24 items-center gap-8 border-b border-cream-400 py-14 last:border-0 lg:grid-cols-2 lg:gap-16 lg:py-20"
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-3xl border border-cream-400",
                c.reverse && "lg:order-2",
              )}
            >
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className={cn(c.reverse && "lg:order-1")}>
              <p className="kicker">{c.kicker}</p>
              <h2 className="mt-3 text-[1.6rem] leading-tight text-clay-600 sm:text-[2rem]">
                {c.title}
              </h2>
              <p className="mt-2.5 font-gujarati text-[0.95rem] text-terracotta-400">
                {c.gujarati}
              </p>
              <div className="mt-5 space-y-4 text-[0.95rem] leading-[1.75] text-clay-400">
                {c.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* --------------------------------------------------------- promise */}
      <section id="promise" className="scroll-mt-24 bg-inverse py-16 text-on-inverse-muted lg:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mustard-200">
              Our Promise
            </p>
            <h2 className="mt-3 text-[1.8rem] leading-tight text-on-inverse sm:text-[2.3rem]">
              Four things you can hold us to.
            </h2>
          </div>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <li key={p.n}>
                <p className="font-display text-3xl text-mustard-200/60">{p.n}</p>
                <div className="stitch-line my-4 w-12 text-on-inverse-muted/30" aria-hidden />
                <h3 className="font-display text-[1.08rem] leading-snug text-on-inverse">
                  {p.t}
                </h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-on-inverse-muted/65">
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
            “A godadi is the only thing in an Indian house that gets passed down
            because it is useful, not because it is precious.”
          </blockquote>
          <figcaption className="mt-6 text-[0.85rem] text-clay-300">
            <span className="font-semibold text-clay-500">Madhuben Rathod</span> ·
            Head quilter, Vadodara workshop
          </figcaption>
        </figure>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
            Shop the collection
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Talk to us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
