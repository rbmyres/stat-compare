"use client";

import { cn } from "@/lib/utils/cn";

const POSITIONS = ["QB", "WR", "RB", "TE"] as const;
export type Position = (typeof POSITIONS)[number];

interface PositionFilterProps {
  selected: Set<Position>;
  onChange: (selected: Set<Position>) => void;
}

export function PositionFilter({ selected, onChange }: PositionFilterProps) {
  function toggle(pos: Position) {
    // If all are selected, narrow to just the clicked position
    if (allSelected) {
      onChange(new Set([pos]));
      return;
    }
    const next = new Set(selected);
    if (next.has(pos)) {
      // Don't allow deselecting the last one
      if (next.size > 1) next.delete(pos);
    } else {
      next.add(pos);
    }
    onChange(next);
  }

  const allSelected = selected.size === POSITIONS.length;

  function toggleAll() {
    if (allSelected) return;
    onChange(new Set(POSITIONS));
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        Pos
      </span>
      <div className="inline-flex h-7 overflow-hidden rounded border border-foreground/[0.08]">
        <button
          type="button"
          onClick={toggleAll}
          className={cn(
            "cursor-pointer px-2 text-[11px] font-semibold tracking-wide transition-all duration-100",
            "border-r border-foreground/[0.08]",
            allSelected
              ? "bg-nfl-navy text-white"
              : "bg-white text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/60"
          )}
        >
          All
        </button>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => toggle(pos)}
            className={cn(
              "cursor-pointer px-2 text-[11px] font-semibold tracking-wide transition-all duration-100",
              "border-r border-foreground/[0.08] last:border-r-0",
              !allSelected && selected.has(pos)
                ? "bg-nfl-navy text-white"
                : "bg-white text-foreground/40 hover:bg-foreground/[0.03] hover:text-foreground/60"
            )}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}

export { POSITIONS };
