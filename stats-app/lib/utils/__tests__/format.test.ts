import { num, fmt, dec, pct, epa, parseRecord } from "../format";

describe("num", () => {
  it("returns 0 for null", () => expect(num(null)).toBe(0));
  it("returns 0 for undefined", () => expect(num(undefined)).toBe(0));
  it("returns 0 for empty string", () => expect(num("")).toBe(0));
  it("returns 0 for NaN string", () => expect(num("abc")).toBe(0));
  it("converts numeric string", () => expect(num("42.5")).toBe(42.5));
  it("passes through numbers", () => expect(num(7)).toBe(7));
  it("handles 0", () => expect(num(0)).toBe(0));
  it("handles negative numbers", () => expect(num(-3.2)).toBe(-3.2));
  it("converts boolean true to 1", () => expect(num(true)).toBe(1));
  it("converts boolean false to 0", () => expect(num(false)).toBe(0));
});

describe("fmt", () => {
  it("returns em dash for null", () => expect(fmt(null)).toBe("\u2014"));
  it("returns em dash for undefined", () => expect(fmt(undefined)).toBe("\u2014"));
  it("formats with locale separators", () => expect(fmt(1500)).toBe("1,500"));
  it("formats zero", () => expect(fmt(0)).toBe("0"));
  it("formats string numbers", () => expect(fmt("3000")).toBe("3,000"));
  it("formats negative numbers", () => expect(fmt(-42)).toBe("-42"));
  it("formats NaN string as 0", () => expect(fmt("abc")).toBe("0"));
});

describe("dec", () => {
  it("returns em dash for null", () => expect(dec(null)).toBe("\u2014"));
  it("returns em dash for undefined", () => expect(dec(undefined)).toBe("\u2014"));
  it("formats with 1 decimal by default", () => expect(dec(7.456)).toBe("7.5"));
  it("accepts custom digit count", () => expect(dec(7.456, 2)).toBe("7.46"));
  it("pads to specified digits", () => expect(dec(7, 2)).toBe("7.00"));
  it("formats zero", () => expect(dec(0)).toBe("0.0"));
  it("formats negative", () => expect(dec(-1.23)).toBe("-1.2"));
  it("formats string number", () => expect(dec("99.9", 0)).toBe("100"));
});

describe("pct", () => {
  it("returns em dash for null", () => expect(pct(null)).toBe("\u2014"));
  it("returns em dash for undefined", () => expect(pct(undefined)).toBe("\u2014"));
  it("appends % sign", () => expect(pct(65.3)).toBe("65.3%"));
  it("handles zero", () => expect(pct(0)).toBe("0.0%"));
  it("handles 100", () => expect(pct(100)).toBe("100.0%"));
});

describe("epa", () => {
  it("returns em dash for null", () => expect(epa(null)).toBe("\u2014"));
  it("returns em dash for undefined", () => expect(epa(undefined)).toBe("\u2014"));
  it("prefixes positive with +", () => expect(epa(3.14)).toBe("+3.14"));
  it("no prefix for negative", () => expect(epa(-2.5)).toBe("-2.50"));
  it("no prefix for zero", () => expect(epa(0)).toBe("0.00"));
  it("formats small positive", () => expect(epa(0.01)).toBe("+0.01"));
  it("formats string number", () => expect(epa("5")).toBe("+5.00"));
});

describe("parseRecord", () => {
  it("parses W-L", () => expect(parseRecord("12-5")).toBe(12));
  it("parses W-L-T with ties", () => expect(parseRecord("10-5-2")).toBe(11));
  it("parses W-L-T with single tie", () => expect(parseRecord("10-5-1")).toBe(10.5));
  it("returns NaN for invalid", () => expect(parseRecord("abc")).toBeNaN());
  it("returns NaN for empty string", () => expect(parseRecord("")).toBeNaN());
  it("handles all zeros", () => expect(parseRecord("0-0")).toBe(0));
  it("handles W-L with no ties", () => expect(parseRecord("17-0")).toBe(17));
  it("handles single digit", () => expect(parseRecord("5")).toBeNaN());
});
