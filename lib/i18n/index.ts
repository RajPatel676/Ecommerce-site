import { en, type Dict } from "@/lib/i18n/en";
import { gu } from "@/lib/i18n/gu";

export type Lang = "en" | "gu";
export const LANGS: Lang[] = ["en", "gu"];
export const LANG_COOKIE = "vg.lang";
export const DEFAULT_LANG: Lang = "en";

const DICTS: Record<Lang, Dict> = { en, gu };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? en;
}

export function isLang(v: unknown): v is Lang {
  return v === "en" || v === "gu";
}

export const LANG_LABEL: Record<Lang, { name: string; native: string }> = {
  en: { name: "English", native: "English" },
  gu: { name: "Gujarati", native: "ગુજરાતી" },
};

export type { Dict };
