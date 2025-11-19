import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Login as admin before each test
  await page.goto('/');
  await page
    .getByTestId('demo-admin')
    .or(page.getByRole('button', { name: /login as admin/i }))
    .click();
  await page.waitForURL(/\/dashboard/i);
});

test('create → list → delete task', async ({ page }) => {
  // Navigate to tasks
  await page.getByRole('link', { name: /tasks/i }).click();
  await page.waitForURL(/\/tasks/i);

  // Create new task
  await page
    .getByTestId('task-new')
    .or(page.getByRole('button', { name: /new task|create/i }))
    .click();
  
  await page.getByPlaceholder(/title/i).fill('Playwright Task');
  await page.getByPlaceholder(/description/i).fill('E2E generated');
  await page.getByRole('button', { name: /save|create/i }).click();

  // Verify task appears in list
  await expect(page.getByText('Playwright Task')).toBeVisible();

  // Delete the task
  const row = page.locator('tr', { hasText: 'Playwright Task' });
  const delBtn = row
    .getByTestId('task-delete')
    .or(row.getByRole('button', { name: /delete/i }));
  
  await delBtn.click();
  
  // Verify task is removed
  await expect(page.getByText('Playwright Task')).toHaveCount(0);
});
