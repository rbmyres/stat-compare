"use client";

import { cn } from "@/lib/utils/cn";
import { MIN_WEEK, MAX_WEEK } from "@/lib/filters/search-params";

interface WeekSelectProps {
  label: string;
  value: number;
  onChange: (week: number) => void;
  min?: number;
  max?: number;
}

export function WeekSelect({
  label,
  value,
  onChange,
  min = MIN_WEEK,
  max = MAX_WEEK,
}: WeekSelectProps) {
  const weeks: number[] = [];
  for (let w = min; w <= max; w++) {
    weeks.push(w);
  }

  return (
    <div className="flex items-center gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "h-7 appearance-none rounded border border-foreground/[0.08] bg-white pl-2 pr-6 font-mono text-xs font-medium tabular-nums text-foreground",
            "transition-all duration-100",
            "hover:border-foreground/20 hover:bg-foreground/[0.02]",
            "focus:border-nfl-navy/40 focus:outline-none focus:ring-1 focus:ring-nfl-navy/15"
          )}
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              Wk {w}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-foreground/25"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
