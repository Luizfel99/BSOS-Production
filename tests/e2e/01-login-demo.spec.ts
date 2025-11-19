import { test, expect } from '@playwright/test';

test.describe('Login Demo → Dashboard', () => {
  test('admin demo button logs in and lands on dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Fallback selector: data-testid OR text
    const demoBtn = page
      .locator('[data-testid="demo-admin"]')
      .or(page.getByRole('button', { name: /login as admin/i }));
    
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();

    // Should redirect to /dashboard and show KPIs
    await page.waitForURL(/\/dashboard/i, { timeout: 15000 });
    await expect(
      page.getByTestId('kpi-total-tasks').or(page.getByText(/total tasks/i))
    ).toBeVisible();
  });

  test('i18n: toggle EN/PT/ES on login page', async ({ page }) => {
    await page.goto('/login');
    
    const langSelect = page.locator('[data-testid="lang-select"]');
    await expect(langSelect).toBeVisible();
    
    // Test Portuguese
    await langSelect.selectOption('pt');
    await expect(page.getByText(/Entrar/i)).toBeVisible();
    
    // Test Spanish
    await langSelect.selectOption('es');
    await expect(page.getByText(/Iniciar sesión/i)).toBeVisible();
    
    // Test English
    await langSelect.selectOption('en');
    await expect(page.getByText(/Sign In|Login/i)).toBeVisible();
  });
});
