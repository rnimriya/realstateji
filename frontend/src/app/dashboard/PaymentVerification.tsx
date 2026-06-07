"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentVerification() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Reload the page to check if the webhook activated the user status in PostgreSQL
          router.refresh();
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col justify-center items-center p-6 text-center">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <div className="absolute w-8 h-8 bg-violet-100 dark:bg-violet-950/20 text-violet-600 rounded-full flex items-center justify-center font-bold text-xs">
              {seconds}
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Activating Premium Access
        </h2>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 mb-6">
          We are confirming your Stripe subscription payment. Setting up your clause extraction dashboard...
        </p>

        {/* Action button */}
        <button
          onClick={() => {
            router.refresh();
            window.location.reload();
          }}
          className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          Check status now
        </button>
      </div>
    </div>
  );
}
