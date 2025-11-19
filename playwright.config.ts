import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT || 3020);

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI 
    ? [['list'], ['html', { outputFolder: 'playwright-report' }]] 
    : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
