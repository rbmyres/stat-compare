import { test, expect } from "@playwright/test";

test.describe("Player Stats", () => {
  test("passing stats table has sortable columns", async ({ page }) => {
    await page.goto("/players/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Table should have header cells
    const headers = page.locator("th");
    await expect(headers.first()).toBeVisible();
    expect(await headers.count()).toBeGreaterThan(5);
  });

  test("clicking a column header sorts the table", async ({ page }) => {
    await page.goto("/players/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Click a sortable header (e.g. "Yards")
    const yardsHeader = page.locator("th").filter({ hasText: "Yards" }).first();
    await yardsHeader.click();
    // Header should show sort indicator
    await expect(yardsHeader).toHaveAttribute("aria-sort");
  });

  test("table displays player data with links", async ({ page }) => {
    await page.goto("/players/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Table body should have player links
    const playerLinks = page.locator("tbody a");
    await expect(playerLinks.first()).toBeVisible();
    expect(await playerLinks.count()).toBeGreaterThan(0);
  });

  test("pagination appears for large datasets", async ({ page }) => {
    await page.goto("/players/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Pagination nav should be visible if there are > 50 players
    const paginationNav = page.locator("nav[aria-label='Pagination']");
    // May or may not have pagination depending on data
    if (await paginationNav.isVisible()) {
      await expect(paginationNav.getByRole("button").first()).toBeVisible();
    }
  });

  test("date range filter controls are present", async ({ page }) => {
    await page.goto("/players/passing");
    // Filter selects should be visible
    await expect(page.locator("select").first()).toBeVisible();
  });
});
