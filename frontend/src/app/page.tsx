import UploadDocument from "@/components/UploadDocument";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Background Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[30rem] bg-gradient-to-tr from-violet-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/20 text-violet-750 dark:text-violet-400 border border-violet-200/50 dark:border-violet-900/30 mb-6 uppercase tracking-wider animate-pulse">
            ⚡ Powered by GPT-4o Structured Outputs
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl leading-tight sm:leading-none mb-6">
            Ingest Legal Contracts. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 bg-clip-text text-transparent">
              Extract Key Clauses.
            </span> Instantly.
          </h1>

          {/* Description */}
          <p className="text-zinc-550 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg mb-8">
            Upload contract agreements, deeds, or lease documents to extract critical clauses like termination rules, liability limits, and renewal dates in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-16">
            <a
              href="#upload-zone"
              className="w-full sm:w-auto py-3.5 px-8 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-500/15 hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Get Started Free
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3.5 px-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl font-semibold text-sm transition-all duration-200 text-center"
            >
              Pricing Plans
            </Link>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-y border-zinc-200/60 dark:border-zinc-800/60 py-8 text-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm rounded-3xl px-6">
            {[
              { val: "2.4M+", label: "Contracts Ingested" },
              { val: "99.4%", label: "Accuracy Rate" },
              { val: "15s", label: "Average Parse Time" },
              { val: "$2.5M+", label: "Legal Hours Saved" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-1">
                  {stat.val}
                </span>
                <span className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="w-full max-w-6xl px-6 py-12 md:py-16 bg-zinc-100/50 dark:bg-zinc-950/30 rounded-3xl border border-zinc-200/50 dark:border-zinc-900/40">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
              Automate Contract Ingestion Workflows
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Everything you need to turn raw agreement documents into structured, queryable databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Serverless OCR Ingestion",
                desc: "Direct parser extracts clean, structured text representations from standard or complex legal PDF formats.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                ),
              },
              {
                title: "Structured Clause Mapping",
                desc: "Strict schema enforcement using OpenAI Structured Outputs prevents generic, corrupted, or missing JSON data.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                ),
              },
              {
                title: "Verification Dashboards",
                desc: "Stylized split-screen review editor displaying original PDF files side-by-side with extracted clause inputs.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                ),
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-violet-500/20 dark:hover:border-violet-900/30 transition-all duration-300 group"
              >
                <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 p-2.5 rounded-xl w-fit text-violet-600 dark:text-violet-400 mb-4 transition-transform duration-300 group-hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feat.icon}
                  </svg>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* UPLOAD DEMO ZONE */}
        <section id="upload-zone" className="w-full max-w-4xl px-6 py-16 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
              Try Ingesting a Document
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Drag in a real estate contract or lease agreement to view AI clause extraction in action.
            </p>
          </div>

          <div className="w-full relative group p-1.5 rounded-3xl bg-gradient-to-tr from-violet-500/10 via-indigo-500/10 to-transparent dark:from-violet-950/20 shadow-2xl hover:from-violet-500/20 transition-all duration-500">
            <div className="absolute inset-0 bg-violet-600/5 dark:bg-violet-900/5 rounded-3xl blur-2xl -z-10 group-hover:opacity-100 transition-opacity" />
            <UploadDocument />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="w-full max-w-6xl px-6 py-12 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "DocuExtract AI has transformed our document review workflow. We parsed 1,200 lease agreements in an afternoon and identified termination clause inconsistencies in minutes.",
                author: "Sarah Jenkins",
                role: "Senior Counsel, Horizon Real Estate",
              },
              {
                quote: "The split-screen review dashboard makes auditing AI predictions instant. Having direct CSV export functionality allowed us to sync verified outputs directly to our legal ledger database.",
                author: "Marcus Vance",
                role: "Managing Attorney, Vance & Associates Group",
              },
            ].map((test, idx) => (
              <div key={idx} className="flex flex-col justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-650 dark:text-zinc-350 italic leading-relaxed mb-6">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{test.author}</h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-450">{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 border-t border-zinc-200 dark:border-zinc-850 text-xs text-zinc-500 dark:text-zinc-600 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; 2026 DocuExtract AI Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors">Pricing</Link>
            <Link href="/dashboard" className="hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
