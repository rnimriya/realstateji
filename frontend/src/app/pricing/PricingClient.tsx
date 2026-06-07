"use client";

import React, { useState } from "react";
import { createCheckoutSessionAction } from "@/app/actions/stripe";

export default function PricingClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckoutSessionAction();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error || "Failed to initialize subscription checkout.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-350 hover:shadow-violet-500/5 hover:border-violet-550/30 group">
      {/* Visual Accent/Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/15 transition-all duration-350" />

      {/* Plan Header */}
      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          Premium Plan
        </h3>
        <p className="text-zinc-550 dark:text-zinc-400 text-xs">
          Ideal for legal departments and real estate firms.
        </p>
      </div>

      {/* Pricing display */}
      <div className="flex items-baseline gap-2 mb-8 relative z-10">
        <span className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          $200
        </span>
        <span className="text-zinc-550 dark:text-zinc-400 font-medium text-sm">
          / month
        </span>
      </div>

      {/* Features Checklist */}
      <ul className="space-y-4 mb-8 relative z-10 text-sm">
        {[
          "Unlimited PDF uploads & clause extractions",
          "Expert AI analysis for complex documents",
          "Verification / split-screen review dashboard",
          "Instant CSV data downloads",
          "Secure, encrypted document storage",
          "Priority support & updates",
        ].map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-zinc-650 dark:text-zinc-350">
            <svg
              className="w-5 h-5 text-violet-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Error Message banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs flex gap-2 animate-fadeIn">
          <svg
            className="w-4 h-4 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full relative z-10 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border bg-violet-600 hover:bg-violet-700 text-white border-transparent shadow-lg shadow-violet-500/15 hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connecting to Stripe...
          </>
        ) : (
          "Subscribe & Unlock Dashboard"
        )}
      </button>

      <div className="mt-4 text-center">
        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
          Secure checkout by Stripe
        </span>
      </div>
    </div>
  );
}
