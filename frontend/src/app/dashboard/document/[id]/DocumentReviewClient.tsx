"use client";

import React, { useState } from "react";
import Link from "next/link";
import { verifyDocumentAction } from "@/app/actions/document";

interface DocumentData {
  id: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  status: string;
  extractedData: any; // Stored JSON
  organizationId: string;
  uploadedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DocumentReviewClientProps {
  document: DocumentData;
}

/**
 * Formats snake_case or camelCase keys into capitalized, space-separated label strings.
 */
function formatLabel(key: string): string {
  const spaced = key.replace(/_/g, " ").replace(/([A-Z])/g, " $1");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
}

export default function DocumentReviewClient({ document: initialDoc }: DocumentReviewClientProps) {
  const [doc, setDoc] = useState<DocumentData>(initialDoc);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data = initialDoc.extractedData || {};
    // Ensure all values are converted to strings for editing
    const initialForm: Record<string, string> = {};
    Object.keys(data).forEach((key) => {
      initialForm[key] = typeof data[key] === "object" ? JSON.stringify(data[key]) : String(data[key]);
    });
    return initialForm;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Serve document URL from Next.js public uploads folder
  const documentUrl = doc.fileKey;

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Re-construct the JSON object to update
      const updatedJson: Record<string, any> = {};
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        // Attempt parsing if it looks like a JSON array/object, otherwise keep string
        if (
          (val.startsWith("{") && val.endsWith("}")) ||
          (val.startsWith("[") && val.endsWith("]"))
        ) {
          try {
            updatedJson[key] = JSON.parse(val);
          } catch {
            updatedJson[key] = val;
          }
        } else {
          updatedJson[key] = val;
        }
      });

      const res = await verifyDocumentAction(doc.id, updatedJson);

      if (res.success && res.document) {
        setDoc(res.document);
        setSuccess(true);
      } else {
        throw new Error(res.error || "Failed to update document.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-150 dark:border-zinc-800 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-200">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Ingestion
            </button>
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight max-w-xs md:max-w-md truncate">
            {doc.fileName}
          </span>
        </div>

        {/* Dynamic Status Badge */}
        <div>
          {doc.status === "VERIFIED" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 shadow-sm shadow-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified & Approved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 shadow-sm shadow-amber-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pending Verification
            </span>
          )}
        </div>
      </header>

      {/* Split-Screen Dashboard Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Left Column: PDF Viewer */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-10rem)] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-3 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Document Viewer
            </span>
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 underline font-medium"
            >
              Open in new tab
            </a>
          </div>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center relative">
            {documentUrl ? (
              <iframe
                src={`${documentUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none"
                title="Original Document PDF"
              />
            ) : (
              <p className="text-sm text-zinc-400">PDF not available for display.</p>
            )}
          </div>
        </div>

        {/* Right Column: AI Extraction Verification Editor */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-10rem)] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-3 border-b border-zinc-150 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              AI Clause Review Editor
            </span>
          </div>

          <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Scrollable Fields Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                Edit any fields below to correct the AI extraction, then click "Save & Verify" to lock the results and update the status.
              </p>

              {Object.keys(formData).length > 0 ? (
                Object.keys(formData).map((key) => {
                  const val = formData[key];
                  const label = formatLabel(key);
                  const isLongText = val.length > 50;

                  return (
                    <div key={key} className="flex flex-col">
                      <label
                        htmlFor={key}
                        className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide"
                      >
                        {label}
                      </label>
                      {isLongText ? (
                        <textarea
                          id={key}
                          value={val}
                          rows={3}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-150"
                        />
                      ) : (
                        <input
                          type="text"
                          id={key}
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-150"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-zinc-400">No extracted clauses available.</p>
                </div>
              )}
            </div>

            {/* Bottom Actions Area */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-800 flex flex-col gap-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-900/30">
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Document saved and verified successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || doc.status === "VERIFIED"}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white rounded-xl font-medium transition duration-200 shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transform"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    <span>Saving Changes...</span>
                  </>
                ) : doc.status === "VERIFIED" ? (
                  <span>Verified & Approved</span>
                ) : (
                  <span>Save & Verify</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
