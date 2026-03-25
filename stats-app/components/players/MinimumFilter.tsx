"use client";

interface MinimumFilterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function MinimumFilter({ label, value, onChange }: MinimumFilterProps) {
  const inputId = `min-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/30">
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        min={0}
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(isNaN(v) || v < 0 ? 0 : v);
        }}
        className="h-7 w-16 rounded border border-foreground/8 bg-background px-2 text-[12px] font-medium tabular-nums text-foreground/70 outline-none transition-colors focus:border-nfl-navy focus:ring-1 focus:ring-nfl-navy/20"
      />
    </div>
  );
}
