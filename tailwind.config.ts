import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        /* ---- Vasundhara textile palette -----------------------------------
           Values live in app/globals.css as CSS variables so a theme swap
           changes what every existing utility class means, with no markup
           churn. `<alpha-value>` keeps `/50` opacity modifiers working.
           ------------------------------------------------------------------ */
        cream: {
          50: "rgb(var(--c-cream-50) / <alpha-value>)",
          100: "rgb(var(--c-cream-100) / <alpha-value>)",
          200: "rgb(var(--c-cream-200) / <alpha-value>)",
          300: "rgb(var(--c-cream-300) / <alpha-value>)",
          400: "rgb(var(--c-cream-400) / <alpha-value>)",
          500: "rgb(var(--c-cream-500) / <alpha-value>)",
        },
        terracotta: {
          50: "rgb(var(--c-terracotta-50) / <alpha-value>)",
          100: "rgb(var(--c-terracotta-100) / <alpha-value>)",
          200: "rgb(var(--c-terracotta-200) / <alpha-value>)",
          300: "rgb(var(--c-terracotta-300) / <alpha-value>)",
          400: "rgb(var(--c-terracotta-400) / <alpha-value>)",
          500: "rgb(var(--c-terracotta-500) / <alpha-value>)",
          600: "rgb(var(--c-terracotta-600) / <alpha-value>)",
          700: "rgb(var(--c-terracotta-700) / <alpha-value>)",
        },
        clay: {
          50: "rgb(var(--c-clay-50) / <alpha-value>)",
          100: "rgb(var(--c-clay-100) / <alpha-value>)",
          200: "rgb(var(--c-clay-200) / <alpha-value>)",
          300: "rgb(var(--c-clay-300) / <alpha-value>)",
          400: "rgb(var(--c-clay-400) / <alpha-value>)",
          500: "rgb(var(--c-clay-500) / <alpha-value>)",
          600: "rgb(var(--c-clay-600) / <alpha-value>)",
          700: "rgb(var(--c-clay-700) / <alpha-value>)",
        },
        mustard: {
          50: "rgb(var(--c-mustard-50) / <alpha-value>)",
          100: "rgb(var(--c-mustard-100) / <alpha-value>)",
          200: "rgb(var(--c-mustard-200) / <alpha-value>)",
          300: "rgb(var(--c-mustard-300) / <alpha-value>)",
          400: "rgb(var(--c-mustard-400) / <alpha-value>)",
        },
        leaf: {
          50: "rgb(var(--c-leaf-50) / <alpha-value>)",
          100: "rgb(var(--c-leaf-100) / <alpha-value>)",
          200: "rgb(var(--c-leaf-200) / <alpha-value>)",
          300: "rgb(var(--c-leaf-300) / <alpha-value>)",
          400: "rgb(var(--c-leaf-400) / <alpha-value>)",
          500: "rgb(var(--c-leaf-500) / <alpha-value>)",
        },
        rose: {
          50: "rgb(var(--c-rose-50) / <alpha-value>)",
          100: "rgb(var(--c-rose-100) / <alpha-value>)",
          200: "rgb(var(--c-rose-200) / <alpha-value>)",
          300: "rgb(var(--c-rose-300) / <alpha-value>)",
          400: "rgb(var(--c-rose-400) / <alpha-value>)",
        },

        /* Raised surfaces — white on light, a warm near-black on dark. */
        card: "rgb(var(--c-card) / <alpha-value>)",

        /* Blocks that are deliberately dark in BOTH themes: the brand-story
           band, the admin sidebar, overlay scrims. */
        inverse: {
          DEFAULT: "rgb(var(--c-inverse) / <alpha-value>)",
          2: "rgb(var(--c-inverse-2) / <alpha-value>)",
        },
        "on-inverse": {
          DEFAULT: "rgb(var(--c-on-inverse) / <alpha-value>)",
          muted: "rgb(var(--c-on-inverse-muted) / <alpha-value>)",
        },

        /* Text on a filled accent or status colour. */
        "on-accent": "rgb(var(--c-on-accent) / <alpha-value>)",

        ink: "rgb(var(--c-ink) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        gujarati: ["var(--font-gujarati)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(46,29,22,.04), 0 8px 24px -12px rgba(46,29,22,.16)",
        lift: "0 2px 4px rgba(46,29,22,.05), 0 18px 40px -18px rgba(46,29,22,.28)",
        drawer: "-12px 0 48px -12px rgba(46,29,22,.28)",
      },
      backgroundImage: {
        "stitch-x":
          "repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "none" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "none" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "none" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(.96)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .5s ease both",
        "slide-in-right": "slide-in-right .35s cubic-bezier(.22,1,.36,1) both",
        "slide-in-left": "slide-in-left .3s cubic-bezier(.22,1,.36,1) both",
        "slide-up": "slide-up .35s cubic-bezier(.22,1,.36,1) both",
        "scale-in": "scale-in .28s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
