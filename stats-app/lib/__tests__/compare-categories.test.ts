import {
  getCompareCategories,
  PLAYER_COMPARE_CATEGORIES,
  TEAM_COMPARE_CATEGORIES,
  LOWER_IS_BETTER,
} from "../compare-categories";

describe("getCompareCategories", () => {
  it("returns player categories for player mode", () => {
    expect(getCompareCategories("player")).toBe(PLAYER_COMPARE_CATEGORIES);
  });

  it("returns team categories for team mode", () => {
    expect(getCompareCategories("team")).toBe(TEAM_COMPARE_CATEGORIES);
  });
});

describe("PLAYER_COMPARE_CATEGORIES", () => {
  it("excludes team-only categories", () => {
    const titles = PLAYER_COMPARE_CATEGORIES.map((c) => c.title);
    expect(titles).not.toContain("Team Overview");
    expect(titles).not.toContain("Team Efficiency");
    expect(titles).not.toContain("Situational");
  });

  it("includes player stat categories", () => {
    const titles = PLAYER_COMPARE_CATEGORIES.map((c) => c.title);
    expect(titles).toContain("Passing");
    expect(titles).toContain("Rushing");
    expect(titles).toContain("Receiving");
  });

  it("every category has at least one stat", () => {
    for (const cat of PLAYER_COMPARE_CATEGORIES) {
      expect(cat.stats.length).toBeGreaterThan(0);
    }
  });
});

describe("TEAM_COMPARE_CATEGORIES", () => {
  it("includes off/def prefixed stats", () => {
    const allStats = TEAM_COMPARE_CATEGORIES.flatMap((c) => c.stats);
    expect(allStats.some((s) => s.startsWith("off_"))).toBe(true);
    expect(allStats.some((s) => s.startsWith("def_"))).toBe(true);
  });

  it("has both offense and defense categories", () => {
    const titles = TEAM_COMPARE_CATEGORIES.map((c) => c.title);
    expect(titles.some((t) => t.includes("Off"))).toBe(true);
    expect(titles.some((t) => t.includes("Def"))).toBe(true);
  });

  it("every category has at least one stat", () => {
    for (const cat of TEAM_COMPARE_CATEGORIES) {
      expect(cat.stats.length).toBeGreaterThan(0);
    }
  });
});

describe("LOWER_IS_BETTER", () => {
  it("contains known negative player stats", () => {
    expect(LOWER_IS_BETTER.has("pass_ints")).toBe(true);
    expect(LOWER_IS_BETTER.has("rush_fumbles")).toBe(true);
    expect(LOWER_IS_BETTER.has("pass_sack_percent")).toBe(true);
  });

  it("contains known negative team stats", () => {
    expect(LOWER_IS_BETTER.has("def_yards_total")).toBe(true);
    expect(LOWER_IS_BETTER.has("off_turnovers")).toBe(true);
    expect(LOWER_IS_BETTER.has("def_points_per_game")).toBe(true);
  });

  it("does not contain positive stats", () => {
    expect(LOWER_IS_BETTER.has("pass_yards")).toBe(false);
    expect(LOWER_IS_BETTER.has("rush_touchdowns")).toBe(false);
    expect(LOWER_IS_BETTER.has("off_pass_yards")).toBe(false);
  });
});
