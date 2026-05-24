"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-label text-ember/60 mb-4">Something went wrong</p>
        <h2 className="text-display-md text-platinum mb-4">
          An error<br />
          <span className="italic text-acid">occurred.</span>
        </h2>
        <p className="text-sm text-platinum/40 mb-8 max-w-sm mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="bg-acid text-ink px-6 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors"
        >
          Try Again →
        </button>
      </div>
    </div>
  );
}
