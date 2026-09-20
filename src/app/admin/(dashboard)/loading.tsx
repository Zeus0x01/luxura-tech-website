export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-8" role="status" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded bg-navy-900/10" />
      <div className="h-64 animate-pulse rounded-xl bg-navy-900/5" />
    </div>
  );
}
