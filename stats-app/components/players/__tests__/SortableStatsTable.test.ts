import { getPageNumbers } from "../SortableStatsTable";

describe("getPageNumbers", () => {
  it("returns all pages for 7 or fewer total", () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns all pages for exactly 7", () => {
    expect(getPageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("returns single page", () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });

  it("shows ellipsis for page 1 of many", () => {
    const result = getPageNumbers(1, 20);
    expect(result).toEqual([1, 2, "...", 20]);
  });

  it("shows ellipsis for last page of many", () => {
    const result = getPageNumbers(20, 20);
    expect(result).toEqual([1, "...", 19, 20]);
  });

  it("shows both ellipses for middle page", () => {
    const result = getPageNumbers(10, 20);
    expect(result).toEqual([1, "...", 9, 10, 11, "...", 20]);
  });

  it("shows neighbors of current page", () => {
    const result = getPageNumbers(5, 20);
    expect(result).toContain(4);
    expect(result).toContain(5);
    expect(result).toContain(6);
  });

  it("always includes first and last page", () => {
    const result = getPageNumbers(10, 50);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(50);
  });

  it("handles page 2 (near start)", () => {
    const result = getPageNumbers(2, 20);
    expect(result).toEqual([1, 2, 3, "...", 20]);
  });

  it("handles second-to-last page", () => {
    const result = getPageNumbers(19, 20);
    expect(result).toEqual([1, "...", 18, 19, 20]);
  });
});
