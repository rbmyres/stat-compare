"use client";

import { cn } from "@/lib/utils/cn";

interface OffDefToggleProps {
  value: "offense" | "defense";
  onChange: (value: "offense" | "defense") => void;
}

const OPTIONS = [
  { key: "offense" as const, label: "Offense" },
  { key: "defense" as const, label: "Defense" },
];

export function OffDefToggle({ value, onChange }: OffDefToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        Side
      </span>
      <div className="inline-flex h-7 overflow-hidden rounded border border-foreground/[0.08]">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "px-2.5 text-[11px] font-semibold tracking-wide transition-all duration-100",
              "border-r border-foreground/[0.08] last:border-r-0",
              value === opt.key
                ? "bg-nfl-navy text-white"
                : "bg-white text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/60"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
