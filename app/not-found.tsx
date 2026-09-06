import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cream-500 bg-cream-200 text-terracotta-400">
          <Compass className="h-7 w-7" />
        </span>
        <p className="mt-6 font-display text-5xl text-clay-300">404</p>
        <h1 className="mt-3 font-display text-2xl text-clay-600">
          This page has come apart at the seams.
        </h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-clay-400">
          The page you were looking for is not here. The godadis, thankfully, are
          exactly where we left them.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={cn(buttonVariants())}>
            Browse the collection
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
