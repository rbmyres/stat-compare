import {
  getStatDefinition,
  getStatDescription,
  getStatDisplayLabel,
  STAT_DEFINITIONS,
  GLOSSARY_CATEGORIES,
} from "../stat-definitions";

describe("getStatDefinition", () => {
  it("finds direct key", () => {
    expect(getStatDefinition("pass_yards")?.label).toBe("Pass Yards");
  });

  it("strips off_ prefix", () => {
    expect(getStatDefinition("off_pass_yards")?.label).toBe("Pass Yards");
  });

  it("strips def_ prefix", () => {
    expect(getStatDefinition("def_rush_yards")?.label).toBe("Rush Yards");
  });

  it("returns undefined for unknown key", () => {
    expect(getStatDefinition("nonexistent_stat")).toBeUndefined();
  });

  it("returns all fields for a known stat", () => {
    const def = getStatDefinition("pass_rating");
    expect(def).toEqual(
      expect.objectContaining({
        label: "Passer Rating",
        abbr: "Rating",
      })
    );
    expect(def?.description).toBeTruthy();
  });
});

describe("getStatDescription", () => {
  it("returns description string for known key", () => {
    const desc = getStatDescription("pass_touchdowns");
    expect(desc).toContain("passing touchdowns");
  });

  it("returns description for prefixed key", () => {
    expect(getStatDescription("off_pass_yards")).toBeTruthy();
  });

  it("returns undefined for unknown", () => {
    expect(getStatDescription("nope")).toBeUndefined();
  });
});

describe("getStatDisplayLabel", () => {
  it("returns base label for plain keys", () => {
    expect(getStatDisplayLabel("pass_yards")).toBe("Pass Yards");
  });

  it("appends (Off) for off_ prefix", () => {
    expect(getStatDisplayLabel("off_pass_yards")).toBe("Pass Yards (Off)");
  });

  it("appends (Def) for def_ prefix", () => {
    expect(getStatDisplayLabel("def_rush_yards")).toBe("Rush Yards (Def)");
  });

  it("falls back to key for unknown stat", () => {
    expect(getStatDisplayLabel("unknown_thing")).toBe("unknown_thing");
  });
});

describe("STAT_DEFINITIONS", () => {
  it("has entries", () => {
    expect(Object.keys(STAT_DEFINITIONS).length).toBeGreaterThan(100);
  });

  it("every entry has label, abbr, and description", () => {
    for (const [key, def] of Object.entries(STAT_DEFINITIONS)) {
      expect(def.label, `${key} missing label`).toBeTruthy();
      expect(def.abbr, `${key} missing abbr`).toBeTruthy();
      expect(def.description, `${key} missing description`).toBeTruthy();
    }
  });
});

describe("GLOSSARY_CATEGORIES", () => {
  it("has categories", () => {
    expect(GLOSSARY_CATEGORIES.length).toBeGreaterThan(5);
  });

  it("every category has a title and stats", () => {
    for (const cat of GLOSSARY_CATEGORIES) {
      expect(cat.title).toBeTruthy();
      expect(cat.stats.length).toBeGreaterThan(0);
    }
  });

  it("all stat keys in categories exist in STAT_DEFINITIONS", () => {
    for (const cat of GLOSSARY_CATEGORIES) {
      for (const key of cat.stats) {
        expect(
          STAT_DEFINITIONS[key],
          `${key} in category "${cat.title}" not found in STAT_DEFINITIONS`
        ).toBeDefined();
      }
    }
  });
});
