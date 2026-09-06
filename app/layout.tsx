import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Serif_Gujarati } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { StoreProvider } from "@/components/store/store-provider";
import {
  ThemeProvider,
  noFlashScript,
} from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { DEFAULT_LANG, LANG_COOKIE, isLang } from "@/lib/i18n";

// Latin display face — only referenced when the page is in English, so it is
// not preloaded and its class is only applied for that language.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces carries no Gujarati glyphs, so Gujarati headings need their own
// display face. It is 115 kB, so it is never preloaded and its class is only
// attached when the page is actually in Gujarati.
const gujaratiDisplay = Noto_Serif_Gujarati({
  subsets: ["gujarati"],
  weight: ["600"],
  variable: "--font-gujarati-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hansaben-godadi.example"),
  title: {
    default: "Hansaben Godadi — Handcrafted warmth, made with tradition",
    template: "%s · Hansaben Godadi",
  },
  description:
    "હંસાબેન ગોદડી — traditional Gujarati godadi, pieced and quilted by hand. Premium cotton quilts for modern Indian homes.",
  keywords: [
    "godadi",
    "ગોદડી",
    "Gujarati quilt",
    "handmade quilt",
    "cotton quilt India",
    "patchwork",
  ],
  openGraph: {
    title: "Hansaben Godadi",
    description: "Handcrafted warmth, made with tradition.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F1E6",
  width: "device-width",
  initialScale: 1,
};

/**
 * Only attach the faces the page will actually render. Without this the
 * English site downloads 150 kB of Gujarati fonts it never draws with, and
 * the Gujarati site downloads Fraunces for headings it never uses.
 */
function fontClass(lang: string) {
  const base = sans.variable;
  return lang === "gu"
    ? `${base} ${gujaratiDisplay.variable}`
    : `${base} ${display.variable}`;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read on the server so the first HTML is already in the right language.
  const stored = cookies().get(LANG_COOKIE)?.value;
  const lang = isLang(stored) ? stored : DEFAULT_LANG;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={fontClass(lang)}
    >
      <head>
        {/* Applies the saved theme before first paint — no light-mode flash. */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        <LanguageProvider initialLang={lang}>
          <ThemeProvider>
          <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-inverse focus:px-5 focus:py-2.5 focus:text-sm focus:text-on-inverse"
          >
            Skip to content
          </a>
          {children}
          <Toaster />
          </StoreProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
