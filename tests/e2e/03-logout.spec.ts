import { test, expect } from '@playwright/test';

test('logout returns to login', async ({ page }) => {
  // Login as admin
  await page.goto('/');
  await page
    .getByTestId('demo-admin')
    .or(page.getByRole('button', { name: /login as admin/i }))
    .click();
  
  await page.waitForURL(/\/dashboard/i);

  // Find and click logout button
  const logoutBtn = page
    .getByTestId('logout')
    .or(page.getByRole('button', { name: /logout/i }));
  
  await expect(logoutBtn).toBeVisible();
  await logoutBtn.click();

  // Verify redirect to login page
  await page.waitForURL(/\/login|^\//i);
  await expect(
    page.getByText(/Sign In|Login|Entrar|Iniciar sesión/i)
  ).toBeVisible();
});
