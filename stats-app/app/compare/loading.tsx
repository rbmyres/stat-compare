export default function CompareLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-56 rounded bg-foreground/10" />
      <div className="flex gap-3 mb-6">
        <div className="h-9 w-20 rounded-md bg-foreground/[0.06]" />
        <div className="h-9 w-20 rounded-md bg-foreground/[0.06]" />
      </div>
      <div className="h-10 w-64 rounded-lg bg-foreground/[0.06] mb-6" />
      <div className="rounded-lg border border-foreground/[0.06] p-4">
        <div className="flex gap-8 justify-center mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-foreground/10" />
              <div className="h-3 w-16 rounded bg-foreground/[0.06]" />
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 border-t border-foreground/[0.04] py-3">
            <div className="h-3 w-24 rounded bg-foreground/[0.06]" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-4 w-12 rounded bg-foreground/10" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
