"use client";

import Link from "next/link";

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold tracking-tight">Failed to load team</h2>
      <p className="text-sm text-foreground/50">
        {error.message === "Failed to fetch data"
          ? "Unable to connect to the database. Please try again."
          : "Could not load this team's stats."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-nfl-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nfl-navy/90"
        >
          Try again
        </button>
        <Link
          href="/teams/passing"
          className="rounded-md border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5"
        >
          Browse teams
        </Link>
      </div>
    </div>
  );
}
