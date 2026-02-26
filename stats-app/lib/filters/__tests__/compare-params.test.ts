import { parseAsCommaList, COMPARE_MODES } from "../compare-params";

describe("parseAsCommaList", () => {
  it("parses comma-separated string into array", () => {
    expect(parseAsCommaList.parse("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("filters empty segments", () => {
    expect(parseAsCommaList.parse("a,,b,")).toEqual(["a", "b"]);
  });

  it("returns empty array for empty string", () => {
    expect(parseAsCommaList.parse("")).toEqual([]);
  });

  it("handles single value", () => {
    expect(parseAsCommaList.parse("abc")).toEqual(["abc"]);
  });

  it("serializes array to comma string", () => {
    expect(parseAsCommaList.serialize(["x", "y"])).toBe("x,y");
  });

  it("serializes empty array to empty string", () => {
    expect(parseAsCommaList.serialize([])).toBe("");
  });

  it("serializes single-element array", () => {
    expect(parseAsCommaList.serialize(["only"])).toBe("only");
  });
});

describe("COMPARE_MODES", () => {
  it("contains player and team", () => {
    expect(COMPARE_MODES).toEqual(["player", "team"]);
  });
});
