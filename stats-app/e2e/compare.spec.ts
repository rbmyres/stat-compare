import { test, expect } from "@playwright/test";

test.describe("Compare", () => {
  test("compare page shows mode toggle", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.getByRole("button", { name: /player/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /team/i })).toBeVisible();
  });

  test("can search and add an entity", async ({ page }) => {
    await page.goto("/compare");
    const searchInput = page.getByPlaceholder(/search/i).last();
    await searchInput.fill("Mahomes");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await page.getByRole("option").first().click();
    // Entity should appear in the selection area
    await expect(page.getByText("Mahomes")).toBeVisible();
  });

  test("switching mode clears selections", async ({ page }) => {
    await page.goto("/compare");
    // Add a player entity first
    const searchInput = page.getByPlaceholder(/search/i).last();
    await searchInput.fill("Mahomes");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5_000 });
    await page.getByRole("option").first().click();
    await expect(page.getByText("Mahomes")).toBeVisible();

    // Switch to team mode
    await page.getByRole("button", { name: /team/i }).click();
    // Player entity should be cleared
    await expect(page.getByText("Mahomes")).not.toBeVisible();
  });

  test("table does not show without enough entities", async ({ page }) => {
    await page.goto("/compare");
    // With no entities, table should not be visible
    await expect(page.locator("table")).not.toBeVisible();
  });
});
