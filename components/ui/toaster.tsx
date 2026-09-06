"use client";

import Link from "next/link";
import { Check, Info, X, AlertTriangle } from "lucide-react";
import { useStore } from "@/components/store/store-provider";
import { cn } from "@/lib/utils";

const TONE = {
  default: { icon: Info, ring: "bg-inverse-2" },
  success: { icon: Check, ring: "bg-leaf-400" },
  error: { icon: AlertTriangle, ring: "bg-rose-300" },
};

export function Toaster() {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:bottom-auto sm:right-0 sm:top-[calc(var(--header-h)+1rem)] sm:items-end sm:p-5"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const tone = TONE[t.tone ?? "default"];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-2xl border border-cream-400 bg-card p-3.5 shadow-lift"
          >
            <span
              className={cn(
                "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white",
                tone.ring,
              )}
              aria-hidden
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-clay-600">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 truncate text-[0.8rem] text-clay-300">
                  {t.description}
                </p>
              )}
              {t.href && (
                <Link
                  href={t.href}
                  onClick={() => dismissToast(t.id)}
                  className="mt-1.5 inline-block text-[0.78rem] font-semibold text-terracotta-500 underline-offset-2 hover:underline"
                >
                  {t.hrefLabel ?? "View"} →
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-clay-200 transition-colors hover:bg-cream-200 hover:text-clay-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
