/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Turbopack (npm run dev) and webpack (npm run build) write incompatible
  // artifacts, so give each its own output folder. Without this, running
  // `npm run build && npm start` after a dev session fails at runtime.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",

  images: {
    // All artwork ships inside /public as WebP — no remote image hosts needed.
    // Next still serves AVIF and per-breakpoint sizes on top of that.
    formats: ["image/avif", "image/webp"],
    // The widths this site actually asks for, so the optimiser does not
    // generate variants nothing renders.
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [48, 56, 64, 80, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    // Pull only the icons each file imports instead of walking the whole
    // lucide-react barrel — this is the single biggest dev-compile saving.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
