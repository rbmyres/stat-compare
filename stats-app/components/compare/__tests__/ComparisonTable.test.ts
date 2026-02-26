import { getBestIndices } from "../ComparisonTable";

describe("getBestIndices", () => {
  it("finds highest value index for normal stats", () => {
    const result = getBestIndices([100, 200, 150], "pass_yards");
    expect(result).toEqual(new Set([1]));
  });

  it("finds lowest value index for LOWER_IS_BETTER stats", () => {
    const result = getBestIndices([5, 3, 8], "pass_ints");
    expect(result).toEqual(new Set([1]));
  });

  it("handles ties (returns all tied indices)", () => {
    const result = getBestIndices([200, 200, 100], "pass_yards");
    expect(result).toEqual(new Set([0, 1]));
  });

  it("returns empty set if all values are equal", () => {
    const result = getBestIndices([100, 100, 100], "pass_yards");
    expect(result).toEqual(new Set());
  });

  it("returns empty set if fewer than 2 valid values", () => {
    const result = getBestIndices([null, 100, undefined], "pass_yards");
    expect(result).toEqual(new Set());
  });

  it("skips null/undefined/empty/NaN values", () => {
    const result = getBestIndices([null, 100, "", 200, NaN], "pass_yards");
    expect(result).toEqual(new Set([3]));
  });

  it("handles all null values", () => {
    const result = getBestIndices([null, null], "pass_yards");
    expect(result).toEqual(new Set());
  });

  it("handles all empty strings", () => {
    const result = getBestIndices(["", ""], "pass_yards");
    expect(result).toEqual(new Set());
  });

  it("handles single valid value among nulls", () => {
    const result = getBestIndices([null, 50, null], "pass_yards");
    expect(result).toEqual(new Set());
  });

  it("handles LOWER_IS_BETTER with ties", () => {
    const result = getBestIndices([3, 5, 3], "pass_ints");
    expect(result).toEqual(new Set([0, 2]));
  });

  it("handles LOWER_IS_BETTER with all equal", () => {
    const result = getBestIndices([5, 5, 5], "pass_ints");
    expect(result).toEqual(new Set());
  });

  it("handles defensive stats (LOWER_IS_BETTER)", () => {
    const result = getBestIndices([300, 250, 350], "def_yards_total");
    expect(result).toEqual(new Set([1]));
  });

  it("handles string numeric values", () => {
    const result = getBestIndices(["100", "200", "150"], "pass_yards");
    expect(result).toEqual(new Set([1]));
  });

  it("handles mixed types", () => {
    const result = getBestIndices([100, "200", null, 150], "pass_yards");
    expect(result).toEqual(new Set([1]));
  });

  it("handles zero values correctly", () => {
    const result = getBestIndices([0, 10, 5], "pass_yards");
    expect(result).toEqual(new Set([1]));
  });

  it("handles negative values", () => {
    const result = getBestIndices([-10, 5, -20], "pass_epa");
    expect(result).toEqual(new Set([1]));
  });
});
