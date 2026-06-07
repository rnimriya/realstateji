import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";

// Disable route caching to ensure the document list is always fresh
export const revalidate = 0;

/**
 * Format file size into human-readable strings (KB / MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/**
 * Format date strings to a readable local date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  // Fetch all documents ordered by creation date descending
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Documents List
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage, review, and export your ingested contract and lease agreements.
            </p>
          </div>

          <Link href="/">
            <button className="py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition duration-200 shadow-md shadow-violet-500/10 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transform cursor-pointer">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>
          </Link>
        </div>

        {/* Documents Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xl overflow-hidden">
          {documents.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-zinc-550/5 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                  {documents.map((doc) => {
                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors duration-150"
                      >
                        {/* Filename */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-5 h-5 text-zinc-400 group-hover:text-zinc-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 max-w-xs truncate">
                              {doc.fileName}
                            </span>
                          </div>
                        </td>

                        {/* Upload Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                          {formatDate(doc.createdAt.toISOString())}
                        </td>

                        {/* File Size */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                          {formatFileSize(doc.fileSize)}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.status === "VERIFIED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Verified
                            </span>
                          )}
                          {doc.status === "COMPLETED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              Needs Review
                            </span>
                          )}
                          {doc.status === "PROCESSING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Processing
                            </span>
                          )}
                          {doc.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Pending
                            </span>
                          )}
                          {doc.status === "FAILED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/40 dark:border-red-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Failed
                            </span>
                          )}
                        </td>

                        {/* Review Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link href={`/dashboard/document/${doc.id}`}>
                            <button className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border border-zinc-250 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 cursor-pointer">
                              Review
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border border-zinc-150 dark:border-zinc-850 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                No documents found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-6">
                Get started by uploading and extracting clauses from legal agreements.
              </p>
              <Link href="/">
                <button className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition duration-150 cursor-pointer">
                  Ingest your first document
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
