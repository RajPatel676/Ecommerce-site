"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import {
  ACCENTS,
  useTheme,
  type Accent,
  type Mode,
} from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

const MODES: { key: Mode; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

export function ThemePicker({
  className,
  align = "right",
}: {
  className?: string;
  align?: "right" | "left";
}) {
  const { mode, accent, resolved, setMode, setAccent, ready } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ActiveIcon =
    mode === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-expanded={open}
        aria-haspopup="menu"
        className="grid h-10 w-10 place-items-center rounded-full text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500"
      >
        {/* Rendered only once the stored theme is known, so the icon never
            contradicts the page it sits on. */}
        {ready ? (
          <ActiveIcon className="h-[1.15rem] w-[1.15rem]" />
        ) : (
          <Palette className="h-[1.15rem] w-[1.15rem]" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-12 z-50 w-64 animate-scale-in rounded-2xl border border-cream-400 bg-card p-3 shadow-lift",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <p className="px-1 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-clay-300">
            Appearance
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                role="menuitemradio"
                aria-checked={mode === m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-[0.72rem] transition-colors",
                  mode === m.key
                    ? "border-terracotta-400 bg-terracotta-50 font-medium text-terracotta-500"
                    : "border-cream-400 text-clay-400 hover:border-clay-200 hover:bg-cream-200",
                )}
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            ))}
          </div>

          <div className="stitch-line my-3 text-cream-500" aria-hidden />

          <p className="px-1 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-clay-300">
            Colour theme
          </p>
          <ul className="space-y-0.5">
            {ACCENTS.map((a) => (
              <li key={a.key}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={accent === a.key}
                  onClick={() => setAccent(a.key as Accent)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors",
                    accent === a.key ? "bg-cream-200" : "hover:bg-cream-200",
                  )}
                >
                  {/* three-band chip: page ground, border, accent */}
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-black/15"
                  >
                    {a.preview[resolved].map((c, i) => (
                      <span key={i} className="h-full flex-1" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.82rem] leading-tight text-clay-600">
                      {a.name}
                    </span>
                    <span className="block font-gujarati text-[0.68rem] leading-tight text-clay-300">
                      {a.gujarati}
                    </span>
                  </span>
                  {accent === a.key && (
                    <Check className="h-4 w-4 shrink-0 text-terracotta-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
