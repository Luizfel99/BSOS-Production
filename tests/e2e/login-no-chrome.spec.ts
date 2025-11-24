import { test, expect } from "@playwright/test";

test("login page has no global chrome", async ({ page }) => {
  await page.goto("/login");
  const labels = ["Dashboard", "Tasks", "Team", "Properties", "Finance", "Notifications"];
  for (const label of labels) {
    await expect(page.getByRole("link", { name: label })).toHaveCount(0);
  }
});
