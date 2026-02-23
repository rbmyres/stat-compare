"use client";

import { cn } from "@/lib/utils/cn";
import { SEASON_TYPES, type SeasonType } from "@/lib/filters/search-params";

interface SeasonTypeToggleProps {
  value: SeasonType;
  onChange: (type: SeasonType) => void;
}

const LABELS: Record<SeasonType, string> = {
  REG: "Regular",
  POST: "Playoffs",
  BOTH: "Both",
};

export function SeasonTypeToggle({ value, onChange }: SeasonTypeToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        Type
      </span>
      <div className="inline-flex h-7 overflow-hidden rounded border border-foreground/[0.08]">
        {SEASON_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "px-2.5 text-[11px] font-semibold tracking-wide transition-all duration-100",
              "border-r border-foreground/[0.08] last:border-r-0",
              value === type
                ? "bg-nfl-navy text-white"
                : "bg-white text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/60"
            )}
          >
            {LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
