"use client";

import { cn } from "@/lib/utils/cn";

interface BasicAdvancedToggleProps {
  value: "basic" | "advanced";
  onChange: (value: "basic" | "advanced") => void;
}

const OPTIONS = [
  { key: "basic" as const, label: "Basic" },
  { key: "advanced" as const, label: "Advanced" },
];

export function BasicAdvancedToggle({ value, onChange }: BasicAdvancedToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        View
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
