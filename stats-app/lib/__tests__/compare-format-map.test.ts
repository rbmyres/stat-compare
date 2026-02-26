import { formatStatValue } from "../compare-format-map";

describe("formatStatValue", () => {
  it("formats player passing yards with fmt", () => {
    expect(formatStatValue("pass_yards", 4500, "player")).toBe("4,500");
  });

  it("formats player EPA with + prefix", () => {
    expect(formatStatValue("pass_epa", 25.3, "player")).toBe("+25.30");
  });

  it("formats player pct stat with %", () => {
    expect(formatStatValue("pass_comp_percent", 67.5, "player")).toBe("67.5%");
  });

  it("formats team off_pass_yards with fmt", () => {
    expect(formatStatValue("off_pass_yards", 3200, "team")).toBe("3,200");
  });

  it("falls back to fmt for unknown keys", () => {
    expect(formatStatValue("unknown_key", 100, "player")).toBe("100");
  });

  it("handles null values via format functions", () => {
    expect(formatStatValue("pass_yards", null, "player")).toBe("\u2014");
  });

  it("handles undefined values", () => {
    expect(formatStatValue("pass_yards", undefined, "player")).toBe("\u2014");
  });
});
