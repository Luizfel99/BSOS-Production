import { test, expect } from "@playwright/test";

const paths = ["/dashboard", "/tasks", "/team", "/properties", "/finance", "/analytics", "/settings"]; 

test("admin demo can access all main modules", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("demo-admin").click();
  await page.waitForURL(/\/dashboard/i, { timeout: 20000 });

  for (const p of paths) {
    await page.goto(p);
    await expect(page).toHaveURL(new RegExp(p.replace("/", "\\/"), "i"));
    await expect(page.locator("body")).toBeVisible();
  }
});
