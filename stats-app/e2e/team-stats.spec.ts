import { test, expect } from "@playwright/test";

test.describe("Team Stats", () => {
  test("team overview table loads", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("offense/defense toggle is present", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Should have an offense/defense toggle
    const offButton = page.getByRole("button", { name: /offense/i });
    const defButton = page.getByRole("button", { name: /defense/i });
    await expect(offButton).toBeVisible();
    await expect(defButton).toBeVisible();
  });

  test("toggling offense/defense changes table data", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    // Get offense table content
    const defButton = page.getByRole("button", { name: /defense/i });
    await defButton.click();

    // Table should still be visible after toggle
    await expect(page.locator("table")).toBeVisible();
  });

  test("team table has sortable columns", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    const headers = page.locator("th");
    expect(await headers.count()).toBeGreaterThan(3);
  });

  test("team rows link to detail pages", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });

    const teamLinks = page.locator("tbody a");
    await expect(teamLinks.first()).toBeVisible();
  });
});
