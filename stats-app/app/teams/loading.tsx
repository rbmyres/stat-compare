export default function TeamsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="h-8 w-40 rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-24 rounded bg-foreground/[0.06]" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-md bg-foreground/[0.06]" />
          <div className="h-8 w-20 rounded-md bg-foreground/[0.06]" />
        </div>
      </div>
      <div className="rounded-md border border-foreground/[0.06]">
        <div className="border-b border-foreground/[0.06] bg-foreground/[0.025] px-3 py-2">
          <div className="flex gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-3 w-14 rounded bg-foreground/[0.06]" />
            ))}
          </div>
        </div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-foreground/[0.04] px-3 py-3">
            <div className="h-4 w-28 rounded bg-foreground/10" />
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-4 w-12 rounded bg-foreground/[0.06]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
