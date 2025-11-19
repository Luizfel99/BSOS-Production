import { test, expect } from "@playwright/test";

test.describe("Login page must NOT show demo/re-seed banners", () => {
  test("no demo banner or credentials visible", async ({ page }) => {
    await page.goto("/login");

    // NÃO deve existir banner/testid
    await expect(page.getByTestId("demo-info-banner")).toHaveCount(0);

    // NÃO deve existir esses textos
    const forbidden = [
      /Demo:/i,
      /Re-Seed/i,
      /ReSeed/i,
      /admin@demo\.local/i,
      /manager@demo\.local/i,
      /supervisor@demo\.local/i,
      /cleaner@demo\.local/i,
      /client@demo\.local/i,
      /demo123/i,
    ];
    for (const rx of forbidden) {
      await expect(page.getByText(rx)).toHaveCount(0);
    }
  });
});
