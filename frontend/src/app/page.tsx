import UploadDocument from "@/components/UploadDocument";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
      {/* Header Bar */}
      <header className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="bg-violet-600 p-2 rounded-lg text-white shadow-md shadow-violet-500/10">
            <svg
              className="w-6 h-6"
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
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-850 flex items-center justify-center text-sm font-semibold text-violet-700 dark:text-violet-400">
            U
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 md:py-24">
        <div className="w-full max-w-xl text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border border-violet-200/50 dark:border-violet-900/30 mb-4 animate-bounce">
            ⚡ Now powered by Serverless OCR
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
            Automated Clause Extraction
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm md:text-base">
            Upload contract agreements, deeds, or lease documents to extract key clauses instantly.
          </p>
        </div>

        <UploadDocument />
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-zinc-150 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600 bg-white dark:bg-zinc-950">
        © 2026 DocuExtract AI. Micro SaaS MVP Architecture.
      </footer>
    </div>
  );
}
