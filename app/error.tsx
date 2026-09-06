"use client";

import { useEffect } from "react";
import { RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real store this would go to an error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cream-500 bg-cream-200 text-terracotta-400">
          <TriangleAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-2xl text-clay-600">
          Something went wrong.
        </h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-clay-400">
          We couldn&apos;t load this page. It is not you — please try again.
        </p>
        <p className="mt-1.5 font-gujarati text-[0.85rem] text-clay-300">
          કંઈક ખોટું થયું. ફરી પ્રયાસ કરો.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        {error.digest && (
          <p className="mt-5 font-mono text-[0.7rem] text-clay-200">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
