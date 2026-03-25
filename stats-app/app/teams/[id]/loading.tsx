export default function TeamDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-18 w-18 rounded bg-foreground/10" />
        <div>
          <div className="h-8 w-48 rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-24 rounded bg-foreground/6" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-foreground/6 p-4">
            <div className="mb-3 h-5 w-32 rounded bg-foreground/10" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j}>
                  <div className="h-3 w-16 rounded bg-foreground/6" />
                  <div className="mt-1 h-5 w-12 rounded bg-foreground/10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
