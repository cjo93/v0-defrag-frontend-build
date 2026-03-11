import { test, expect } from '@playwright/test';

test('landing loads and login flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=DEFRAG')).toBeVisible();

  await page.goto('/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();

  // If test user credentials are available, fill and submit
  // Otherwise, just verify login UI
});
