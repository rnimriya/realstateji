"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper to determine active link styling
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-violet-600 dark:text-violet-400 font-semibold"
        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-150 dark:border-zinc-800 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-violet-600 p-2 rounded-lg text-white shadow-md shadow-violet-500/10 transition-transform duration-200 group-hover:scale-105">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              DocuExtract AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/" className={linkClass("/")}>
              Ingest Documents
            </Link>
          </nav>
        </div>

        {/* Right: User Menu & Logout */}
        <div className="flex items-center gap-4">
          {/* User Avatar Initials */}
          <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/30 border border-violet-250 dark:border-violet-850 flex items-center justify-center text-xs font-semibold text-violet-750 dark:text-violet-400">
            UN
          </div>

          <Link href="/">
            <button className="text-xs font-medium text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer">
              Sign Out
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
