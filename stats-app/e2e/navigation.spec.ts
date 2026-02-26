import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage redirects or loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("player passing stats page loads", async ({ page }) => {
    await page.goto("/players/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("player rushing stats page loads", async ({ page }) => {
    await page.goto("/players/rushing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("player receiving stats page loads", async ({ page }) => {
    await page.goto("/players/receiving");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("player overview stats page loads", async ({ page }) => {
    await page.goto("/players/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("team overview page loads", async ({ page }) => {
    await page.goto("/teams/overview");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("team passing page loads", async ({ page }) => {
    await page.goto("/teams/passing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("team rushing page loads", async ({ page }) => {
    await page.goto("/teams/rushing");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("team situational page loads", async ({ page }) => {
    await page.goto("/teams/situational");
    await expect(page.locator("table")).toBeVisible({ timeout: 10_000 });
  });

  test("compare page loads", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("glossary page loads", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("404 page for invalid route", async ({ page }) => {
    const res = await page.goto("/nonexistent-page");
    expect(res?.status()).toBe(404);
  });

  test("navbar links are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /players/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /teams/i }).first()).toBeVisible();
  });
});
