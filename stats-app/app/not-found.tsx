import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-sm text-foreground/50">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex gap-3">
        <Link
          href="/players/passing"
          className="rounded-md bg-nfl-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nfl-navy/90"
        >
          Browse Players
        </Link>
        <Link
          href="/teams/overview"
          className="rounded-md border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5"
        >
          Browse Teams
        </Link>
      </div>
    </div>
  );
}
