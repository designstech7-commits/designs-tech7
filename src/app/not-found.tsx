import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <span className="text-[30vw] font-display text-white/[0.02] leading-none tracking-tighter select-none">
          404
        </span>
      </div>

      <div className="relative text-center px-6">
        <p className="text-label text-acid/60 mb-4">Error 404</p>
        <h1 className="text-display-lg text-platinum mb-4">
          Frame<br />
          <span className="italic text-acid">Not Found.</span>
        </h1>
        <p className="text-sm text-platinum/40 mb-8 max-w-sm mx-auto leading-relaxed">
          This page doesn't exist in the archive. It may have moved, been removed, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-acid text-ink px-6 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors">
            Return Home →
          </Link>
          <Link href="/portfolio" className="border border-white/10 text-platinum/50 px-6 py-3 text-label font-mono uppercase hover:border-white/20 hover:text-platinum transition-colors">
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
