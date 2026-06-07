import React from "react";
import Navbar from "@/components/Navbar";
import PricingClient from "./PricingClient";

/**
 * Server Component for the Pricing page.
 * Displays simple plan options and routes to checkout.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 max-w-4xl mx-auto w-full">
        {/* Pricing Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/20 text-violet-750 dark:text-violet-400 border border-violet-200/50 dark:border-violet-900/30 mb-4 uppercase tracking-wider">
            Premium Ingestion Access
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm md:text-base">
            Get unlimited access to automated legal clause extractions, CSV downloads, and dashboard tracking.
          </p>
        </div>

        {/* Pricing Card Details Client Component */}
        <PricingClient />
      </main>
    </div>
  );
}
