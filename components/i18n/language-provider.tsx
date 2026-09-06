"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  getDict,
  LANG_COOKIE,
  type Dict,
  type Lang,
} from "@/lib/i18n";

interface LanguageValue {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

/**
 * The language is seeded from a cookie read on the server, so the very first
 * HTML is already in the right language. That avoids both the flash of English
 * a localStorage-only approach would cause and the hydration mismatch that
 * comes with swapping text after mount.
 *
 * Switching is instant: every page that renders copy is a client component
 * reading from this context, so a setState re-renders the whole tree. The
 * cookie is only written so the next visit starts correct.
 */
export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      // one year, root path — readable by the server on the next request
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* cookies disabled — the switch still works for this session */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: getDict(lang), setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

/** Shorthand for the common case: `const t = useT();` then `t.nav.shop`. */
export function useT(): Dict {
  return useLang().t;
}
