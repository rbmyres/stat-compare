import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("search input is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test("typing shows search results", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("Mahomes");
    // Wait for debounced results
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("option").first()).toBeVisible();
  });

  test("clicking a result navigates to detail page", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("Chiefs");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await page.getByRole("option").first().click();
    await page.waitForURL(/\/(players|teams)\//, { timeout: 5_000 });
    expect(page.url()).toMatch(/\/(players|teams)\//);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("Pat");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await input.press("ArrowDown");
    await input.press("Enter");
    await page.waitForURL(/\/(players|teams)\//, { timeout: 5_000 });
    expect(page.url()).toMatch(/\/(players|teams)\//);
  });

  test("escape closes search results", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("Mahomes");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await input.press("Escape");
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("short query does not trigger search", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/search/i);
    await input.fill("M");
    // Wait a bit to ensure no results appear
    await page.waitForTimeout(500);
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });
});
