import { filterSchema, toDbParams } from "../validation";

const valid = {
  startYear: 2024,
  startWeek: 1,
  endYear: 2024,
  endWeek: 18,
  seasonType: "REG" as const,
};

describe("filterSchema", () => {
  it("accepts valid filters", () => {
    expect(() => filterSchema.parse(valid)).not.toThrow();
  });

  it("rejects start week after end week (same year)", () => {
    expect(() =>
      filterSchema.parse({ ...valid, startWeek: 10, endWeek: 5 })
    ).toThrow();
  });

  it("accepts same start and end", () => {
    expect(() =>
      filterSchema.parse({ ...valid, startWeek: 5, endWeek: 5 })
    ).not.toThrow();
  });

  it("accepts start year before end year regardless of weeks", () => {
    expect(() =>
      filterSchema.parse({
        ...valid,
        startYear: 2023,
        startWeek: 18,
        endYear: 2024,
        endWeek: 1,
      })
    ).not.toThrow();
  });

  it("rejects start year after end year", () => {
    expect(() =>
      filterSchema.parse({ ...valid, startYear: 2025, endYear: 2024 })
    ).toThrow();
  });

  it("rejects year below MIN_SEASON (1999)", () => {
    expect(() =>
      filterSchema.parse({ ...valid, startYear: 1998 })
    ).toThrow();
  });

  it("rejects year above CURRENT_SEASON (2025)", () => {
    expect(() =>
      filterSchema.parse({ ...valid, endYear: 2026 })
    ).toThrow();
  });

  it("rejects week below MIN_WEEK (1)", () => {
    expect(() =>
      filterSchema.parse({ ...valid, startWeek: 0 })
    ).toThrow();
  });

  it("rejects week above MAX_WEEK (22)", () => {
    expect(() =>
      filterSchema.parse({ ...valid, endWeek: 23 })
    ).toThrow();
  });

  it("rejects invalid seasonType", () => {
    expect(() =>
      filterSchema.parse({ ...valid, seasonType: "INVALID" })
    ).toThrow();
  });

  it("accepts POST seasonType", () => {
    expect(() =>
      filterSchema.parse({ ...valid, seasonType: "POST" })
    ).not.toThrow();
  });

  it("accepts BOTH seasonType", () => {
    expect(() =>
      filterSchema.parse({ ...valid, seasonType: "BOTH" })
    ).not.toThrow();
  });
});

describe("toDbParams", () => {
  it("maps filter values to DB parameter names", () => {
    const result = toDbParams(valid);
    expect(result).toEqual({
      seasonStart: 2024,
      seasonEnd: 2024,
      weekStart: 1,
      weekEnd: 18,
      seasonType: "REG",
    });
  });

  it("converts BOTH to comma-separated string", () => {
    const result = toDbParams({ ...valid, seasonType: "BOTH" });
    expect(result.seasonType).toBe("REG,POST");
  });

  it("passes POST through unchanged", () => {
    const result = toDbParams({ ...valid, seasonType: "POST" });
    expect(result.seasonType).toBe("POST");
  });

  it("passes REG through unchanged", () => {
    const result = toDbParams(valid);
    expect(result.seasonType).toBe("REG");
  });
});
