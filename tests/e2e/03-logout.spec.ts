import { test, expect } from '@playwright/test';

test('logout returns to login', async ({ page }) => {
  // Login as admin
  await page.goto('/login');
  await page.getByTestId('demo-admin').click();
  
  await page.waitForURL(/\/dashboard/i, { timeout: 20000 });

  // Find and click logout button
  const logoutBtn = page
    .getByTestId('logout')
    .or(page.getByRole('button', { name: /logout|sign out/i }));
  
  await expect(logoutBtn).toBeVisible();
  await logoutBtn.click();

  // Verify redirect to login page
  await page.waitForURL(/\/login|^\//i);
  await expect(
    page.getByText(/Sign In|Login|Entrar|Iniciar sesión/i)
  ).toBeVisible();
});
