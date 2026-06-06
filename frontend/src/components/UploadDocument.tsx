"use client";

import React, { useState, useRef } from "react";

interface UploadResponse {
  message: string;
  filename: string;
  status: string;
  file_size: number;
  extracted_data?: Record<string, any>;
}

export default function UploadDocument() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine the backend API URL dynamically based on environment
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      // On Vercel production, proxy requests to the Vercel services backend prefix
      if (
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        return "/_/backend";
      }
    }
    // Locally, default to localhost:8000
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setSuccess(null);

    // Validate that the file is a PDF
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Only PDF documents are supported.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const baseUrl = getApiUrl();
      const response = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Upload failed. Please try again.");
      }

      const data: UploadResponse = await response.json();
      console.log("Successfully uploaded and extracted data:", data);
      
      setSuccess(`Document "${data.filename}" uploaded and processed successfully!`);
      // Keep file shown but allow resetting
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-150 dark:border-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
        Upload Document
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Ingest legal or real estate PDFs (up to 50 pages) for automated clause extraction.
      </p>

      {/* Drag & Drop Area */}
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-violet-500 bg-violet-50/30 dark:bg-violet-950/10"
            : file
            ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5"
            : "border-zinc-300 dark:border-zinc-700 hover:border-violet-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!file ? onButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {/* File Icon / Upload Icon */}
        {!file ? (
          <div className="flex flex-col items-center text-center">
            <svg
              className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Drag & drop your PDF file here, or{" "}
              <span className="text-violet-500 dark:text-violet-400 underline hover:text-violet-600">
                browse
              </span>
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Only PDF files are supported</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full">
            <svg
              className="w-12 h-12 text-emerald-500 mb-3"
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
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-xs mb-1">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            {!loading && (
              <button
                onClick={removeFile}
                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-medium underline"
              >
                Choose another file
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-900/30">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm border border-emerald-200 dark:border-emerald-900/30">
          {success}
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
            Check the console to view the structured key-value extractions.
          </p>
        </div>
      )}

      {/* Action Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-xl font-medium transition duration-200 shadow-md shadow-violet-500/10 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              {/* Spinner */}
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
              <span>Processing OCR & Extracting...</span>
            </>
          ) : (
            <span>Extract Clauses</span>
          )}
        </button>
      )}
    </div>
  );
}
