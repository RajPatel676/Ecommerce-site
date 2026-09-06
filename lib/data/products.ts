import type { CategoryKey, Product, ProductSize, SizeKey } from "@/lib/types";

/* ------------------------------------------------------------------ sizes */

export const SIZES: Record<SizeKey, ProductSize> = {
  single: {
    key: "single",
    label: "Single",
    dimensions: '60" × 90"',
    priceDelta: 0,
  },
  double: {
    key: "double",
    label: "Double",
    dimensions: '90" × 100"',
    priceDelta: 400,
  },
  king: {
    key: "king",
    label: "King",
    dimensions: '108" × 108"',
    priceDelta: 800,
  },
};

export const SIZE_ORDER: SizeKey[] = ["single", "double", "king"];

/* -------------------------------------------------------------- categories */

export interface Category {
  key: CategoryKey;
  name: string;
  gujarati: string;
  blurb: string;
  blurbGu: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    key: "everyday",
    name: "Everyday Godadi",
    gujarati: "રોજિંદી ગોદડી",
    blurb: "Soft, washable and built for daily use.",
    blurbGu: "નરમ, ધોઈ શકાય તેવી અને રોજ વાપરવા માટે બનેલી.",
    image: "/img/cat-everyday.webp",
  },
  {
    key: "premium",
    name: "Premium Godadi",
    gujarati: "પ્રીમિયમ ગોદડી",
    blurb: "Finer cotton, denser stitching, heirloom finish.",
    blurbGu: "ઝીણું કપાસ, ગીચ ટાંકા, વારસાગત ફિનિશ.",
    image: "/img/cat-premium.webp",
  },
  {
    key: "baby",
    name: "Baby Godadi",
    gujarati: "બાળ ગોદડી",
    blurb: "Gentle weaves and rounded corners for little ones.",
    blurbGu: "નાનાં બાળકો માટે નરમ વણાટ અને ગોળ ખૂણા.",
    image: "/img/cat-baby.webp",
  },
  {
    key: "double",
    name: "Double Bed",
    gujarati: "ડબલ બેડ",
    blurb: "Generous drape for shared beds.",
    blurbGu: "સાથે સૂનારા માટે પૂરતી પહોળી.",
    image: "/img/cat-double.webp",
  },
  {
    key: "single",
    name: "Single Bed",
    gujarati: "સિંગલ બેડ",
    blurb: "Just right for a single bed or a reading corner.",
    blurbGu: "સિંગલ પલંગ કે વાંચવાના ખૂણા માટે બરાબર.",
    image: "/img/cat-single.webp",
  },
  {
    key: "patchwork",
    name: "Traditional Patchwork",
    gujarati: "પરંપરાગત પેચવર્ક",
    blurb: "Blocks pieced by hand, the way it has always been done.",
    blurbGu: "હાથે જોડેલા ટુકડા, જેમ હંમેશાં બનતા આવ્યા છે.",
    image: "/img/cat-patchwork.webp",
  },
];

export function categoryByKey(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

/* ------------------------------------------------------------- swatches */

const SWATCH: Record<string, string> = {
  kutch: "#B4432B",
  rangoli: "#C0553B",
  madhurya: "#8B4A3B",
  gulabi: "#B5445A",
  heritage: "#7C2D2D",
  baby: "#D9A05B",
  indigo: "#2E4159",
  haldi: "#C9A227",
  mitti: "#8A5A3B",
  sindoor: "#A32B2B",
  vann: "#4A6B5D",
  chandan: "#B08968",
  morpankh: "#2F6B63",
  kesari: "#D2691E",
  banni: "#6B3F5B",
  kesudo: "#C2451F",
};

const VARIANT_LABEL: Record<string, { label: string; gujarati: string }> = {
  kutch: { label: "Kutch Red", gujarati: "કચ્છી લાલ" },
  rangoli: { label: "Rangoli", gujarati: "રંગોળી" },
  madhurya: { label: "Madhurya Brown", gujarati: "માધુર્ય" },
  gulabi: { label: "Gulabi", gujarati: "ગુલાબી" },
  heritage: { label: "Heritage Maroon", gujarati: "વારસો" },
  baby: { label: "Soft Sand", gujarati: "રેતી" },
  indigo: { label: "Indigo", gujarati: "ગળી" },
  haldi: { label: "Haldi", gujarati: "હળદર" },
  mitti: { label: "Mitti", gujarati: "માટી" },
  sindoor: { label: "Sindoor", gujarati: "સિંદૂર" },
  vann: { label: "Vann Green", gujarati: "વન" },
  chandan: { label: "Chandan", gujarati: "ચંદન" },
  morpankh: { label: "Morpankh", gujarati: "મોરપંખ" },
  kesari: { label: "Kesari", gujarati: "કેસરી" },
  banni: { label: "Banni Plum", gujarati: "બન્ની" },
  kesudo: { label: "Kesudo", gujarati: "કેસૂડો" },
};

function mk(
  key: string,
  extra: string[],
): { images: string[]; variants: Product["variants"] } {
  const images = [1, 2, 3, 4].map((n) => `/img/p-${key}-${n}.webp`);
  const variants = [key, ...extra].map((k) => ({
    key: k,
    label: VARIANT_LABEL[k].label,
    gujarati: VARIANT_LABEL[k].gujarati,
    swatch: SWATCH[k],
    image: `/img/p-${k}-1.webp`,
  }));
  return { images, variants };
}

const CARE_STANDARD = [
  "Gentle machine wash on cold, or hand wash with mild detergent",
  "Do not bleach — natural dyes may soften in the first two washes",
  "Line dry in shade; direct sun fades hand-dyed cotton",
  "Warm iron on the reverse if needed",
  "Store folded with a muslin wrap during monsoon",
];

const CARE_BABY = [
  "Machine wash cold with a baby-safe detergent",
  "No bleach, no fabric softener",
  "Tumble dry low or line dry in shade",
  "Wash before first use",
];

/* -------------------------------------------------------------- products */

export const PRODUCTS: Product[] = [
  {
    id: "GDP-001",
    slug: "kutch-patchwork-godadi",
    name: "Kutch Patchwork Godadi",
    gujaratiName: "કચ્છી પેચવર્ક ગોદડી",
    tagline: "Hand-pieced blocks in the deep reds of Kutch",
    description:
      "Our signature godadi, pieced from forty-eight hand-cut cotton blocks and quilted with a running stitch that takes four days to finish. The reds are drawn from the mud-and-mirror homes of Kutch, softened with cream and a thread of mustard.",
    story:
      "Bhachau, in eastern Kutch, is where this piece begins. Six women stitch it between them — one cuts, two piece, three quilt. The pattern has been in their families longer than any of them can say.",
    price: 1499,
    mrp: 2199,
    category: "patchwork",
    categories: ["patchwork", "double", "everyday"],
    sizes: ["single", "double", "king"],
    ...mk("kutch", ["sindoor", "heritage"]),
    rating: 4.8,
    reviewCount: 214,
    stock: 32,
    material: "100% cotton top, cotton batting, cotton backing",
    care: CARE_STANDARD,
    weight: "1.8 kg (double)",
    craftedIn: "Bhachau, Kutch",
    badge: "bestseller",
    featured: true,
    createdAt: "2026-02-14",
  },
  {
    id: "GDP-002",
    slug: "rangoli-cotton-godadi",
    name: "Rangoli Cotton Godadi",
    gujaratiName: "રંગોળી કોટન ગોદડી",
    tagline: "Festival colours, laid out like a doorstep rangoli",
    description:
      "Lightweight and bright, this godadi borrows its geometry from the rangoli drawn outside Gujarati homes at Diwali. Warm enough for winter nights, light enough to keep on the bed all year.",
    story:
      "Drawn from the chalk-and-colour patterns our founder's grandmother made every morning before sunrise.",
    price: 1299,
    mrp: 1899,
    category: "everyday",
    categories: ["everyday", "double", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("rangoli", ["kesari", "haldi"]),
    rating: 4.7,
    reviewCount: 168,
    stock: 41,
    material: "100% cotton, single-layer batting",
    care: CARE_STANDARD,
    weight: "1.4 kg (double)",
    craftedIn: "Vadodara, Gujarat",
    featured: true,
    createdAt: "2026-03-02",
  },
  {
    id: "GDP-003",
    slug: "madhurya-hand-stitched-godadi",
    name: "Madhurya Hand-Stitched Godadi",
    gujaratiName: "માધુર્ય હાથ-સિલાઈ ગોદડી",
    tagline: "Nine stitches to the inch, all by hand",
    description:
      "The Madhurya is our most closely quilted piece — nine hand stitches to the inch across the whole surface. Earth browns, warm sand and a soft olive border. It becomes softer with every wash.",
    story:
      "Named for Madhuben, who has been quilting for our workshop since the first year and still refuses to use a machine.",
    price: 1799,
    mrp: 2499,
    category: "premium",
    categories: ["premium", "double", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("madhurya", ["chandan", "mitti"]),
    rating: 4.9,
    reviewCount: 96,
    stock: 18,
    material: "Long-staple cotton top, double cotton batting",
    care: CARE_STANDARD,
    weight: "2.2 kg (double)",
    craftedIn: "Vadodara, Gujarat",
    badge: "handloom",
    featured: true,
    createdAt: "2026-01-20",
  },
  {
    id: "GDP-004",
    slug: "gulabi-phool-godadi",
    name: "Gulabi Phool Godadi",
    gujaratiName: "ગુલાબી ફૂલ ગોદડી",
    tagline: "Rose pinks and eight-petal flower blocks",
    description:
      "Soft rose, deep plum and cream, arranged around hand-appliquéd eight-petal flowers. A gentle piece for a guest room or a young girl's bed.",
    story:
      "The flower block is a phool motif borrowed from old Saurashtra torans — the hangings placed above a doorway to welcome guests.",
    price: 1399,
    mrp: 1999,
    category: "everyday",
    categories: ["everyday", "single", "patchwork"],
    sizes: ["single", "double"],
    ...mk("gulabi", ["banni", "rangoli"]),
    rating: 4.6,
    reviewCount: 142,
    stock: 27,
    material: "100% cotton with appliqué detail",
    care: CARE_STANDARD,
    weight: "1.5 kg (double)",
    craftedIn: "Rajkot, Gujarat",
    featured: true,
    createdAt: "2026-04-08",
  },
  {
    id: "GDP-005",
    slug: "heritage-gujarati-godadi",
    name: "Heritage Gujarati Godadi",
    gujaratiName: "વારસો ગુજરાતી ગોદડી",
    tagline: "Our heirloom weight — made to outlast us",
    description:
      "The heaviest godadi we make, with three layers of cotton batting and a wide hand-bound border in deep maroon. Warm through a Gujarat winter and sturdy enough to be handed down.",
    story:
      "Built to the specification of the godadis that used to be given as part of a bride's trousseau — the ones that survive three generations.",
    price: 1999,
    mrp: 2899,
    category: "premium",
    categories: ["premium", "double", "patchwork"],
    sizes: ["double", "king"],
    ...mk("heritage", ["sindoor", "kutch"]),
    rating: 4.9,
    reviewCount: 78,
    stock: 12,
    material: "Triple-layer cotton batting, hand-bound border",
    care: CARE_STANDARD,
    weight: "3.1 kg (king)",
    craftedIn: "Bhuj, Kutch",
    badge: "limited",
    featured: true,
    createdAt: "2025-12-11",
  },
  {
    id: "GDP-006",
    slug: "mini-baby-godadi",
    name: "Mini Baby Godadi",
    gujaratiName: "નાની બાળ ગોદડી",
    tagline: "Pre-washed, rounded corners, nothing scratchy",
    description:
      "A small godadi in undyed and lightly dyed cotton, pre-washed twice so it is soft from the first day. Rounded corners, no loose threads, no metal anywhere.",
    story:
      "The first godadi most Gujarati children ever sleep under is a small one made from their parents' old clothes. This is our version of that.",
    price: 899,
    mrp: 1299,
    category: "baby",
    categories: ["baby", "single"],
    sizes: ["single"],
    ...mk("baby", ["chandan", "vann"]),
    rating: 4.8,
    reviewCount: 203,
    stock: 56,
    material: "Pre-washed muslin-backed cotton, azo-free dyes",
    care: CARE_BABY,
    weight: "0.6 kg",
    craftedIn: "Vadodara, Gujarat",
    badge: "bestseller",
    featured: true,
    createdAt: "2026-03-19",
  },
  {
    id: "GDP-007",
    slug: "indigo-blocks-godadi",
    name: "Indigo Blocks Godadi",
    gujaratiName: "ગળી બ્લોક ગોદડી",
    tagline: "Natural indigo against undyed cotton",
    description:
      "Naturally dyed indigo, pieced against cream and a single line of madder red. The blue deepens for the first year and then holds.",
    story:
      "Dyed in vats in a small unit outside Ahmedabad that has been running natural indigo for thirty years.",
    price: 1699,
    mrp: 2399,
    category: "premium",
    categories: ["premium", "double", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("indigo", ["morpankh", "vann"]),
    rating: 4.7,
    reviewCount: 87,
    stock: 22,
    material: "Naturally indigo-dyed cotton",
    care: CARE_STANDARD,
    weight: "1.9 kg (double)",
    craftedIn: "Ahmedabad, Gujarat",
    badge: "new",
    createdAt: "2026-06-01",
  },
  {
    id: "GDP-008",
    slug: "haldi-sun-godadi",
    name: "Haldi Sun Godadi",
    gujaratiName: "હળદર સૂરજ ગોદડી",
    tagline: "Turmeric yellows for a bright room",
    description:
      "Warm mustard and turmeric yellow with cream blocks and a thin terracotta border. The lightest weight we make in a double size.",
    story: "The colour of the haldi ceremony, two days before a Gujarati wedding.",
    price: 1349,
    mrp: 1849,
    category: "everyday",
    categories: ["everyday", "double"],
    sizes: ["single", "double"],
    ...mk("haldi", ["kesari", "rangoli"]),
    rating: 4.5,
    reviewCount: 119,
    stock: 38,
    material: "100% cotton, light batting",
    care: CARE_STANDARD,
    weight: "1.3 kg (double)",
    craftedIn: "Surendranagar, Gujarat",
    createdAt: "2026-05-14",
  },
  {
    id: "GDP-009",
    slug: "mitti-earth-godadi",
    name: "Mitti Earth Godadi",
    gujaratiName: "માટી ગોદડી",
    tagline: "Every brown between clay and khaki",
    description:
      "A quiet godadi in seven shades of brown with an olive stitch line. For rooms that already have enough colour in them.",
    story: "Named for the colour of the ground after the first rain.",
    price: 1549,
    mrp: 2099,
    category: "everyday",
    categories: ["everyday", "double", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("mitti", ["chandan", "madhurya"]),
    rating: 4.6,
    reviewCount: 64,
    stock: 29,
    material: "100% cotton, undyed backing",
    care: CARE_STANDARD,
    weight: "1.7 kg (double)",
    craftedIn: "Vadodara, Gujarat",
    createdAt: "2026-04-22",
  },
  {
    id: "GDP-010",
    slug: "sindoor-border-godadi",
    name: "Sindoor Border Godadi",
    gujaratiName: "સિંદૂર બોર્ડર ગોદડી",
    tagline: "A six-inch hand-bound border in vermilion",
    description:
      "Cream and sand blocks framed by a wide vermilion border, bound entirely by hand. The border alone takes a full day.",
    story: "The border is stitched in a single unbroken line — a small superstition in the workshop.",
    price: 1649,
    mrp: 2299,
    category: "premium",
    categories: ["premium", "double"],
    sizes: ["double", "king"],
    ...mk("sindoor", ["kutch", "heritage"]),
    rating: 4.8,
    reviewCount: 71,
    stock: 16,
    material: "Cotton with hand-bound border",
    care: CARE_STANDARD,
    weight: "2.0 kg (double)",
    craftedIn: "Bhuj, Kutch",
    createdAt: "2026-02-28",
  },
  {
    id: "GDP-011",
    slug: "vann-green-godadi",
    name: "Vann Green Godadi",
    gujaratiName: "વન ગોદડી",
    tagline: "Forest greens with a cream field",
    description:
      "Deep green, sage and cream. The calmest piece in the collection and the one most often bought for a study or a reading chair.",
    story: "Vann means forest. The greens are taken from the gir woodland after monsoon.",
    price: 1449,
    mrp: 1999,
    category: "single",
    categories: ["single", "everyday"],
    sizes: ["single", "double"],
    ...mk("vann", ["morpankh", "mitti"]),
    rating: 4.7,
    reviewCount: 88,
    stock: 34,
    material: "100% cotton",
    care: CARE_STANDARD,
    weight: "1.4 kg (double)",
    craftedIn: "Junagadh, Gujarat",
    createdAt: "2026-05-30",
  },
  {
    id: "GDP-012",
    slug: "chandan-sandalwood-godadi",
    name: "Chandan Sandalwood Godadi",
    gujaratiName: "ચંદન ગોદડી",
    tagline: "Pale sandalwood tones, barely there",
    description:
      "Our most neutral godadi — sandalwood, oat and warm white with a single rust accent. Reads almost plain from across a room, detailed up close.",
    story: "Made for customers who wrote in asking for something quieter.",
    price: 1399,
    mrp: 1849,
    category: "everyday",
    categories: ["everyday", "single", "double"],
    sizes: ["single", "double", "king"],
    ...mk("chandan", ["baby", "mitti"]),
    rating: 4.5,
    reviewCount: 57,
    stock: 44,
    material: "100% cotton, natural finish",
    care: CARE_STANDARD,
    weight: "1.5 kg (double)",
    craftedIn: "Vadodara, Gujarat",
    createdAt: "2026-06-18",
  },
  {
    id: "GDP-013",
    slug: "morpankh-peacock-godadi",
    name: "Morpankh Peacock Godadi",
    gujaratiName: "મોરપંખ ગોદડી",
    tagline: "Peacock teal with a gold stitch",
    description:
      "Teal and sea green blocks quilted in a mustard-gold thread, so the stitch line reads as a pattern of its own.",
    story: "The peacock is Gujarat's most-drawn bird, and its blue-green is the hardest to get right in cotton.",
    price: 1749,
    mrp: 2399,
    category: "premium",
    categories: ["premium", "double", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("morpankh", ["indigo", "vann"]),
    rating: 4.8,
    reviewCount: 63,
    stock: 19,
    material: "Cotton top with mercerised gold-tone quilting thread",
    care: CARE_STANDARD,
    weight: "1.8 kg (double)",
    craftedIn: "Ahmedabad, Gujarat",
    badge: "new",
    createdAt: "2026-07-04",
  },
  {
    id: "GDP-014",
    slug: "kesari-saffron-godadi",
    name: "Kesari Saffron Godadi",
    gujaratiName: "કેસરી ગોદડી",
    tagline: "Saffron and burnt orange, warm as a lamp",
    description:
      "The warmest colour story we make. Saffron, burnt orange and cream, with a deep brown binding to hold it all down.",
    story: "Every workshop has one colour it makes best. Ours is this orange.",
    price: 1499,
    mrp: 2099,
    category: "double",
    categories: ["double", "everyday", "patchwork"],
    sizes: ["single", "double", "king"],
    ...mk("kesari", ["kesudo", "haldi"]),
    rating: 4.7,
    reviewCount: 131,
    stock: 31,
    material: "100% cotton",
    care: CARE_STANDARD,
    weight: "1.7 kg (double)",
    craftedIn: "Vadodara, Gujarat",
    badge: "bestseller",
    createdAt: "2026-03-27",
  },
  {
    id: "GDP-015",
    slug: "banni-plum-godadi",
    name: "Banni Plum Godadi",
    gujaratiName: "બન્ની ગોદડી",
    tagline: "Plum and mauve, edged in gold",
    description:
      "An unusual palette for a godadi — deep plum with dusty mauve and a gold stitch. Made in a small run each season.",
    story: "The Banni grasslands turn this exact colour in the last hour before dark.",
    price: 1849,
    mrp: 2599,
    category: "premium",
    categories: ["premium", "double"],
    sizes: ["double", "king"],
    ...mk("banni", ["gulabi", "heritage"]),
    rating: 4.6,
    reviewCount: 42,
    stock: 9,
    material: "Cotton with gold-tone quilting thread",
    care: CARE_STANDARD,
    weight: "2.0 kg (double)",
    craftedIn: "Bhuj, Kutch",
    badge: "limited",
    createdAt: "2026-07-21",
  },
  {
    id: "GDP-016",
    slug: "kesudo-flame-godadi",
    name: "Kesudo Flame Godadi",
    gujaratiName: "કેસૂડો ગોદડી",
    tagline: "The orange-red of the flame-of-the-forest",
    description:
      "Bright kesudo orange against forest green and cream, in a chevron and diamond layout. Our most photographed piece.",
    story:
      "Kesudo — the flame-of-the-forest — blooms across Gujarat just before Holi. This is that fortnight, in cotton.",
    price: 1599,
    mrp: 2249,
    category: "patchwork",
    categories: ["patchwork", "double", "everyday"],
    sizes: ["single", "double", "king"],
    ...mk("kesudo", ["kesari", "kutch"]),
    rating: 4.8,
    reviewCount: 109,
    stock: 25,
    material: "100% cotton",
    care: CARE_STANDARD,
    weight: "1.7 kg (double)",
    craftedIn: "Godhra, Gujarat",
    createdAt: "2026-06-09",
  },
];

/* ------------------------------------------------------------- selectors */

export function getProduct(idOrSlug: string) {
  return PRODUCTS.find((p) => p.slug === idOrSlug || p.id === idOrSlug);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured);
}

export function priceForSize(p: Product, size: SizeKey) {
  return p.price + SIZES[size].priceDelta;
}

export function mrpForSize(p: Product, size: SizeKey) {
  return p.mrp + SIZES[size].priceDelta;
}

export function relatedProducts(p: Product, n = 4) {
  return PRODUCTS.filter(
    (x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c)),
  ).slice(0, n);
}

export const PRICE_BOUNDS = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price + SIZES.king.priceDelta)),
};
