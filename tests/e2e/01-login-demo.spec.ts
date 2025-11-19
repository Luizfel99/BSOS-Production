import { test, expect } from '@playwright/test';

test.describe('Login Demo → Dashboard', () => {
  test('admin demo button logs in and lands on dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('demo-admin')).toBeVisible();
    await page.getByTestId('demo-admin').click();

    await page.waitForURL(/\/dashboard/i, { timeout: 20000 });
    await expect(page.getByTestId('kpi-total-tasks').or(page.getByText(/total tasks/i))).toBeVisible();
  });

  test('i18n: toggle EN/PT/ES on login page', async ({ page }) => {
    await page.goto('/login');
    const langSelect = page.getByTestId('lang-select');
    await expect(langSelect).toBeVisible();
    await langSelect.selectOption('pt');
    await expect(page.getByText(/Entrar|Enviar link|Criar usuário|Criar conta/i)).toBeVisible();
    await langSelect.selectOption('es');
    await expect(page.getByText(/Iniciar sesión|Enviar enlace|Crear usuario|Crear cuenta/i)).toBeVisible();
    await langSelect.selectOption('en');
    await expect(page.getByText(/Sign In|Send reset link|Create user|Create account/i)).toBeVisible();
  });
});
