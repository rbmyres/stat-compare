"use client";

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold tracking-tight">Failed to load comparison</h2>
      <p className="text-sm text-foreground/50">
        {error.message === "Failed to fetch data"
          ? "Unable to connect to the database. Please try again."
          : "Could not load the comparison data."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-nfl-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nfl-navy/90"
      >
        Try again
      </button>
    </div>
  );
}
