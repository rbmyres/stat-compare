export function num(v: unknown): number {
  return Number(v) || 0;
}

export function fmt(n: unknown): string {
  const v = num(n);
  return v.toLocaleString("en-US");
}

export function dec(n: unknown, digits = 1): string {
  return num(n).toFixed(digits);
}

export function pct(n: unknown): string {
  return `${dec(n)}%`;
}

export function epa(n: unknown): string {
  const v = num(n);
  const s = v.toFixed(2);
  return v > 0 ? `+${s}` : s;
}
