# હંસાબેન ગોદડી · Hansaben Godadi

**ઘરની હૂંફ, હાથની મહેનત.** — Handcrafted warmth, made with tradition.

A complete, clickable front-end prototype for a fictional Gujarati handmade *godadi*
(quilt) brand. Everything runs in the browser: no database, no payment gateway, no
shipping API, no external image host.

---

## Running it

```bash
npm install
npm run dev      # Turbopack — http://localhost:3000
```

For the real speed picture, run a production build:

```bash
npm run build && npm start
```

> The first `dev`/`build` fetches the three Google fonts (Fraunces, Inter and
> Noto Sans Gujarati) once and caches them, so keep a connection open for that run.

### A note on speed

`next dev` compiles each route the first time you open it and ships
unminified JavaScript, so lines like `Compiled /admin in 190ms` are the dev
server working, not the site being slow. The number that matters is the
*second* request to a route — in a typical dev log that is `GET / 200 in 99ms`.

For the real picture, run the production build:

```bash
npm run preview     # build + start, in one command
```

Measured in a browser against that build:

| Page | Load | First paint |
| --- | --- | --- |
| Home | 345 ms | 392 ms |
| Shop | 207 ms | 192 ms |
| Product | 360 ms | 280 ms |
| Admin | 215 ms | 228 ms |

And on a simulated mid-range phone (4G, 4× CPU throttle), against the
production build:

| | TTFB | First paint | Load |
| --- | --- | --- | --- |
| English | 33 ms | 992 ms | 1.58 s |
| ગુજરાતી | 27 ms | 888 ms | 1.34 s |

The same page under `npm run dev` loads in 2.7–3.4 s, so judge speed against
`npm run preview`, not the dev server.

What keeps it there:

- **Fonts scoped per language.** Fraunces is only attached when the page is in
  English, Noto Serif Gujarati only when it is in Gujarati, and the Gujarati
  text face is self-hosted and subset to the 53 codepoints the app uses. Font
  payload dropped from 457 kB to 238 kB (English) and 167 kB (Gujarati).

- **Turbopack for dev** (`npm run dev`). Cut dev payload from 10.9 MB to
  4.6 MB per page and home TTFB from 9.8 s to ~140 ms.
  `npm run dev:webpack` is the fallback.
- **`optimizePackageImports: ["lucide-react"]`** so an icon import pulls one
  module rather than a 1000-icon barrel file.
- **WebP artwork**, 4.6 MB on disk for 80 files. `next/image` serves AVIF at
  the right breakpoint on top — the homepage delivers 14 images in ~170 kB.
- **Overlays load on first open.** The cart drawer, search and mobile nav are
  `next/dynamic` chunks, so their code is not parsed on page load. Reopening
  is instant once cached (~40 ms first open).
- **Separate dev/build output folders**, so `npm run build` after a dev
  session cannot fail on mismatched Turbopack artifacts.

---

## The five-minute tour

1. **Home** (`/`) — hero, categories, six featured godadis, brand story.
2. **Shop** (`/shop`) — search, category / size / price filters, five sort orders.
3. **Product** (`/product/kutch-patchwork-godadi`) — gallery, size + pattern pickers,
   quantity, expandable detail sections.
4. **Add to cart** — the drawer slides in; the full cart lives at `/cart`
   (try coupon `GODADI10` or `WARMTH250`).
5. **Checkout** (`/checkout`) — validated form, delivery and payment choices.
   *Pay Now* simulates a gateway round-trip and mints a real order ID.
6. **Confirmation** → **Track** (`/track`) — a vertical timeline with timestamps.
7. **Admin** (`/admin`) — dashboard, orders, products, customers, coupons, settings.
8. **Close the loop:** open the new order in `/admin/orders/<id>`, change its status,
   then reload `/track?order=<id>` — the customer timeline has moved.

Sample order to try immediately: **`GD20260906001`**.

---

## What is real and what is mocked

| Real | Mocked |
| --- | --- |
| Cart, wishlist, coupons, order creation | Payment (a 1.6s `setTimeout`) |
| Order status transitions and timelines | Courier tracking ("Mock Express") |
| Search, filters, sorting | Customers, historical revenue, the 7-day chart |
| Form validation | Email sending, login/logout |

State lives in React context and persists to `localStorage`
(`vg.cart.v1`, `vg.wishlist.v1`, `vg.orders.v1`, `vg.coupon.v1`, `vg.searches.v1`).
**Admin → Settings → Reset prototype data** clears it all.

---

## Artwork

Every image in `public/img/` was generated procedurally for this project — flat-lay
quilts, folded stacks, stitch close-ups, room scenes and category tiles, each built
from a Gujarati-inspired palette with hand-stitch detailing. Nothing is fetched from
a stock photo host, so no image can ever 404.

They ship as WebP (4.6 MB for 80 files, half what the JPEGs weighed), and
`next/image` serves AVIF at the right breakpoint on top of that — the homepage
delivers all 14 of its images in about 170 KB.

---

## Structure

```
app/
  (store)/            storefront routes, share the header/footer/cart shell
    page.tsx          home
    shop, product/[slug], cart, checkout,
    order-confirmation/[id], track, about, contact, faq,
    wishlist, account
  admin/              dashboard, orders (+ [id]), products, customers, coupons, settings
  layout.tsx          fonts, StoreProvider, Toaster
  error.tsx           friendly error state
  not-found.tsx       404

components/
  store/store-provider.tsx    cart · wishlist · orders · toasts · UI state
  layout/                     header, footer, mobile nav, logo
  product/                    card + detail
  cart/ checkout/ order/ search/ contact/ shop/ admin/
  ui/                         button, badge, field, accordion, toaster, misc

lib/
  types.ts            domain model + order status flow
  status.ts           status labels, tones and step notes
  utils.ts            cn, ₹ formatting, IST dates
  data/               products (16), orders (12), customers (10), coupons (4)
```

---

## Language — ગુજરાતી / English

A language switch sits beside the theme picker, in both the store header and
the admin bar. It flips the **entire** site: navigation, buttons, forms,
validation messages, order statuses, product names, product descriptions,
care instructions, the About and FAQ prose, and the admin panel.

### How it works

The choice is stored in a `vg.lang` cookie and read **on the server** in the
root layout, so the first HTML that arrives is already in the right language:

```bash
curl -H "Cookie: vg.lang=gu" localhost:3000 | grep 'lang='
# lang="gu"
```

That matters. A `localStorage`-only approach would render English, hydrate,
then swap to Gujarati — a visible flash on every page load, plus a React
hydration mismatch, because the server and client HTML would disagree. Reading
a cookie avoids both. Switching after that is instant client-side state; the
cookie is only written so the *next* visit starts correct.

The trade-off is honest and measurable: reading a cookie opts every route out
of static generation. TTFB went from ~15–25 ms to ~25–45 ms, and First Load JS
from ~125 kB to ~153 kB (both dictionaries ship so switching needs no fetch).
Pages still paint in 224–412 ms. Correct-first-paint was worth ~30 ms.

### Structure

| File | Holds |
| --- | --- |
| `lib/i18n/en.ts` | Every English UI string. `Dict` is inferred from it. |
| `lib/i18n/gu.ts` | Gujarati, typed `Dict` — a missing key fails the build |
| `lib/data/products.gu.ts` | Gujarati catalogue copy, keyed by product id |
| `lib/i18n/content.ts` | Resolves product/category content for the active language |
| `components/i18n/` | Provider, `useT()` hook, and the picker |

Catalogue content is kept apart from UI strings because it is data, not
interface: `productName(p, t)`, `productDescription(p, t)` and friends resolve
it, and each product card shows the other-language name underneath as a
subtitle.

### Typography

Fraunces and Inter carry no Gujarati glyphs, so `html[lang="gu"]` switches the
body to **Noto Sans Gujarati** and headings to **Noto Serif Gujarati**, with a
taller line height — Gujarati matras sit above and below the baseline and
crowd at Latin leading. Prices, order IDs and SKUs stay in the Latin face so
₹1,499 and GD20260906001 remain legible.

---

## Theming

A picker sits in the store header and the admin bar. It sets two things
independently, both saved to `localStorage` (`vg.theme.v1`):

- **Appearance** — Light (the default), Dark, or System. System follows the OS
  and reacts live; a saved choice always wins over the OS setting.
- **Colour theme** — five complete palettes lifted from the artwork:
  Terracotta (કચ્છી લાલ), Indigo (ગળી), Morpankh (મોરપંખ), Banni (બન્ની), Vann (વન).

Each theme recolours the **whole** site, not just the buttons: page grounds,
section bands, cards, borders, form fields and text all shift hue together.
Status colours are the deliberate exception — a "Delivered" badge stays green
in every theme. Ten combinations in total.

### How it works

Every palette colour is a CSS variable in `app/globals.css`, and
`tailwind.config.ts` points each Tailwind colour at one. So `bg-cream-100`
always means *"the page ground"* — the theme just changes what that is. All 928
existing colour classes kept working with no markup churn.

- `.dark` swaps the neutrals. The `cream` ramp becomes dark grounds and the
  `clay` ramp inverts so its high steps are the brightest text.
- `[data-accent="…"]` swaps the full palette for that theme.
- An inline script in `<head>` applies the saved theme before first paint, so
  there is no flash of light theme on load.

Three tokens exist because a single ramp could not do the job:

| Token | Why |
| --- | --- |
| `card` | Raised surfaces. White on light, `#221A15` on dark. |
| `inverse` / `on-inverse` | Blocks that stay dark in *both* themes — the brand-story band, the admin sidebar, image scrims. |
| `on-accent` | Text on a filled accent or status colour. Cream on light, near-black on dark, because the accent ramps invert. |

### Dark palette

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `#FAF5EC` | `#17120F` |
| Card | `#FFFFFF` | `#221A15` |
| Border | `#E5D5BD` | `#382C24` |
| Primary text | `#432A20` | `#F4EADC` |
| Muted text | `#8C6238` | `#A08E7C` |
| Accent (default) | `#B4432B` | `#E0714F` |

Every text/background pairing was measured in the browser across all five
accents in both modes; the lowest is 4.7:1, above the 4.5:1 WCAG AA threshold.
Fixing this also corrected three pre-existing contrast failures in the light
theme (muted text was 3.5:1, the dimmest meta text 2.2:1).

Product photography is left untouched in dark mode — a lit object on a dark
page is the point — but full-bleed editorial images carry an `img-editorial`
class that dims them so they do not glare.

---

## Design system

| Token | Use |
| --- | --- |
| `cream-50…500` | page grounds and surfaces (dark grounds in dark mode) |
| `terracotta-50…700` | primary actions, accents |
| `clay-50…700` | text, dark sections, admin sidebar |
| `mustard`, `leaf`, `rose` | ratings, success, destructive |

Typography: **Fraunces** for display, **Inter** for UI, **Noto Sans Gujarati** for
Gujarati text (`font-display` / `font-sans` / `font-gujarati`).

Responsive by intent, not by shrinking: two-column product grids on mobile, a
full-height nav drawer, a bottom-sheet cart, a single-column checkout, and an admin
panel with its own mobile drawer.

---

## Deploying to Vercel

The project is deploy-ready as-is: no environment variables, no database, no
external services. From the project folder:

```bash
npx vercel          # first run: log in, accept the defaults, get a preview URL
npx vercel --prod   # promote to production
```

Vercel auto-detects Next.js. `vercel.json` only adds cache and security headers.

Verified in a clean room before shipping — a fresh copy, `npm ci` from the
lockfile, then `npm run build` exactly as Vercel runs it. Passes.

A few things that were checked because they bite on deploy:

- `distDir` is conditional (`.next-dev` for Turbopack dev, `.next` for builds).
  Vercel builds with `NODE_ENV=production`, so it resolves to `.next` — the
  directory Vercel expects.
- No `regions` key in `vercel.json`. Pinning a region there fails the build on
  the Hobby plan.
- The build runs on Linux, which is case-sensitive; macOS is not. Every import
  resolves in a Linux build.
- Google Fonts are fetched at build time, which Vercel's builder allows.

### Security advisories

`npm audit` reports four Next.js advisories. None are fixed in any 14.x
release — they require Next 15.5.14 or later, which is a major upgrade
(async `params`, React 19). They are listed here so the decision is yours:

| Advisory | Applies here? |
| --- | --- |
| DoS via Image Optimizer `remotePatterns` | No — every image is a local file in `/public`; `remotePatterns` is unset. |
| HTTP request smuggling in rewrites | No — the app defines no rewrites. |
| Unbounded `next/image` disk cache | Self-hosting issue; on Vercel the image cache is managed by the platform. |
| RSC request deserialization DoS | In range, but the app has no server actions, API routes or middleware. |

The app is entirely static pages plus client-side state, so the attack surface
is small. Upgrading to Next 15 is the clean fix when you want it.

---

## Notes for wiring up a backend later

- `lib/data/*` are the only data sources; swap them for API calls.
- `placeOrder`, `setOrderStatus` and `applyCoupon` in `store-provider.tsx` are the
  three functions a real backend would take over.
- Order IDs are minted as `GD<YYYYMMDD><seq>`; tracking numbers as `MG<9 digits>`.

Built as a design prototype. Hansaben Godadi is a fictional brand, and all
customers, orders, reviews and payment states in this project are invented.
