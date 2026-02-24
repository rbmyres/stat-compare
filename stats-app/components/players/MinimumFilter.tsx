"use client";

interface MinimumFilterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function MinimumFilter({ label, value, onChange }: MinimumFilterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(isNaN(v) || v < 0 ? 0 : v);
        }}
        className="h-7 w-16 rounded border border-foreground/[0.08] bg-white px-2 text-[12px] font-medium tabular-nums text-foreground/70 outline-none transition-colors focus:border-nfl-navy focus:ring-1 focus:ring-nfl-navy/20"
      />
    </div>
  );
}
