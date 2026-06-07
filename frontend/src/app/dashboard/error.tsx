"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error internally
    console.error("Dashboard error boundary captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col justify-center items-center p-6 text-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg
            className="w-8 h-8 text-red-650 dark:text-red-400"
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
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Database Connection Offline
        </h2>
        
        {/* Description */}
        <p className="text-sm text-zinc-550 dark:text-zinc-400 mb-6 leading-relaxed">
          The server could not establish a connection to the PostgreSQL database. If this is a live deployment, please make sure your <code className="bg-zinc-100 dark:bg-zinc-950 px-1 py-0.5 rounded text-xs">DATABASE_URL</code> environment variable is configured correctly and is not pointing to localhost.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-violet-500/10"
          >
            Try again
          </button>
          
          <Link href="/" className="flex-1">
            <button className="w-full py-3 px-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
