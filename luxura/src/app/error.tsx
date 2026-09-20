"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Only the digest is safe to surface; details stay in the server log.
    console.error("Route error", error.digest);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy-600">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-navy-950">We hit an unexpected problem.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">Please try again. If it keeps happening, contact us and we will sort it out.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="h-11 rounded-md bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800">
            Try again
          </button>
          <Link href="/" className="inline-flex h-11 items-center rounded-md border border-navy-900/20 px-6 text-sm font-semibold text-navy-900">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
