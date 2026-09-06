import { Suspense } from "react";
import type { Metadata } from "next";
import { TrackClient } from "@/components/order/track-client";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Follow your Hansaben Godadi from our workshop to your door.",
};

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-16">
          <div className="skeleton mx-auto h-64 max-w-2xl rounded-3xl" />
        </div>
      }
    >
      <TrackClient />
    </Suspense>
  );
}
