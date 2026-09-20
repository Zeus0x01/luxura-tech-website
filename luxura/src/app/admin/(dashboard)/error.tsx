"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-navy-950">Something went wrong</h1>
      <p className="mt-3 text-muted">The page could not be loaded. Your data is safe. Please try again.</p>
      <Button onClick={reset} variant="dark" className="mt-6">
        Try again
      </Button>
    </div>
  );
}
