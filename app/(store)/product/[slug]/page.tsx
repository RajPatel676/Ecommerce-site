import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/misc";
import { PRODUCTS, getProduct, relatedProducts } from "@/lib/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getProduct(params.slug);
  if (!p) return { title: "Godadi not found" };
  return {
    title: p.name,
    description: p.tagline,
    openGraph: { title: p.name, description: p.tagline, images: [p.images[0]] },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);

  return (
    <>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="border-t border-cream-400 bg-cream-200 py-14 weave lg:py-20">
          <div className="container">
            <SectionHeading
              align="left"
              kicker="You may also like"
              title="Made in the same workshop"
            />
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
