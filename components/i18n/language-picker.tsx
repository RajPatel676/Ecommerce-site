"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { LANGS, LANG_LABEL, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguagePicker({
  className,
  align = "right",
}: {
  className?: string;
  align?: "right" | "left";
}) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.changeLanguage}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-clay-500 transition-colors hover:bg-cream-300 hover:text-terracotta-500"
      >
        <Languages className="h-[1.15rem] w-[1.15rem]" />
        <span
          className={cn(
            "text-[0.72rem] font-semibold uppercase tracking-wider",
            lang === "gu" && "font-gujarati normal-case tracking-normal",
          )}
        >
          {lang === "gu" ? "ગુ" : "EN"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-12 z-50 w-44 animate-scale-in rounded-2xl border border-cream-400 bg-card p-2 shadow-lift",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <p className="px-2 pb-1.5 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-clay-300">
            {t.theme.language}
          </p>
          {LANGS.map((l: Lang) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={lang === l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                lang === l ? "bg-cream-200" : "hover:bg-cream-200",
              )}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 text-[0.88rem] text-clay-600",
                  l === "gu" && "font-gujarati",
                )}
              >
                {LANG_LABEL[l].native}
              </span>
              {lang === l && (
                <Check className="h-4 w-4 shrink-0 text-terracotta-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
