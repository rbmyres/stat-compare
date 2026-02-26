export function num(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

export function fmt(n: unknown): string {
  if (n === null || n === undefined) return "\u2014";
  const v = num(n);
  return v.toLocaleString("en-US");
}

export function dec(n: unknown, digits = 1): string {
  if (n === null || n === undefined) return "\u2014";
  return num(n).toFixed(digits);
}

export function pct(n: unknown): string {
  if (n === null || n === undefined) return "\u2014";
  return `${dec(n)}%`;
}

export function epa(n: unknown): string {
  if (n === null || n === undefined) return "\u2014";
  const v = num(n);
  const s = v.toFixed(2);
  return v > 0 ? `+${s}` : s;
}

/** Parse a "W-L" or "W-L-T" record string into a numeric wins value for sorting. */
export function parseRecord(val: string): number {
  const parts = val.split("-").map(Number);
  if (parts.length >= 2 && parts.every((p) => !isNaN(p))) {
    // wins + ties * 0.5 (for W-L-T)
    return parts[0] + (parts[2] ?? 0) * 0.5;
  }
  return NaN;
}
