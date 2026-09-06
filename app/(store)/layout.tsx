import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Overlays } from "@/components/layout/overlays";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Cart drawer, search and mobile nav — loaded on first open. */}
      <Overlays />
    </div>
  );
}
