import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Sans_Gujarati } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/store/store-provider";
import {
  ThemeProvider,
  noFlashScript,
} from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const gujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gujarati",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vasundhara-godadi.example"),
  title: {
    default: "Vasundhara Godadi — Handcrafted warmth, made with tradition",
    template: "%s · Vasundhara Godadi",
  },
  description:
    "વસુંધરા ગોદડી — traditional Gujarati godadi, pieced and quilted by hand. Premium cotton quilts for modern Indian homes.",
  keywords: [
    "godadi",
    "ગોદડી",
    "Gujarati quilt",
    "handmade quilt",
    "cotton quilt India",
    "patchwork",
  ],
  openGraph: {
    title: "Vasundhara Godadi",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${gujarati.variable}`}
    >
      <head>
        {/* Applies the saved theme before first paint — no light-mode flash. */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-dvh font-sans">
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
      </body>
    </html>
  );
}
