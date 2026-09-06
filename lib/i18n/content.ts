import type { Category } from "@/lib/data/products";
import type { Product } from "@/lib/types";
import type { Dict } from "@/lib/i18n/en";
import {
  CARE_BABY_GU,
  CARE_STANDARD_GU,
  PLACE_GU,
  PRODUCTS_GU,
} from "@/lib/data/products.gu";

/**
 * Catalogue content is data, not UI strings, so it lives with the data and is
 * resolved through these helpers. `t.meta.code` tells us which language the
 * caller is rendering in, so components only ever need the dictionary.
 */
const isGu = (t: Dict) => t.meta.code === "gu";

export function categoryName(c: Category, t: Dict) {
  return isGu(t) ? c.gujarati : c.name;
}

export function categoryBlurb(c: Category, t: Dict) {
  return isGu(t) ? (c.blurbGu ?? c.blurb) : c.blurb;
}

export function productName(p: Product, t: Dict) {
  return isGu(t) ? p.gujaratiName : p.name;
}

/** The other-language name, shown as a subtitle under the main one. */
export function productSubName(p: Product, t: Dict) {
  return isGu(t) ? p.name : p.gujaratiName;
}

export function productTagline(p: Product, t: Dict) {
  return isGu(t) ? (PRODUCTS_GU[p.id]?.tagline ?? p.tagline) : p.tagline;
}

export function productDescription(p: Product, t: Dict) {
  return isGu(t)
    ? (PRODUCTS_GU[p.id]?.description ?? p.description)
    : p.description;
}

export function productStory(p: Product, t: Dict) {
  return isGu(t) ? (PRODUCTS_GU[p.id]?.story ?? p.story) : p.story;
}

export function productMaterial(p: Product, t: Dict) {
  return isGu(t) ? (PRODUCTS_GU[p.id]?.material ?? p.material) : p.material;
}

export function productWeight(p: Product, t: Dict) {
  return isGu(t) ? (PRODUCTS_GU[p.id]?.weight ?? p.weight) : p.weight;
}

export function productPlace(p: Product, t: Dict) {
  return isGu(t) ? (PLACE_GU[p.craftedIn] ?? p.craftedIn) : p.craftedIn;
}

export function productCare(p: Product, t: Dict) {
  if (!isGu(t)) return p.care;
  // the catalogue uses two shared care sheets; pick by length
  return p.care.length === 4 ? CARE_BABY_GU : CARE_STANDARD_GU;
}
