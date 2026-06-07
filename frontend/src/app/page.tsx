import UploadDocument from "@/components/UploadDocument";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
      <Navbar />

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
