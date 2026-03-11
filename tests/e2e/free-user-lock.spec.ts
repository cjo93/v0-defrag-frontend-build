import { test, expect } from '@playwright/test';

test('free user sees locked chat and daily briefing', async ({ page }) => {
  // Login as free user if possible, else skip
  await page.goto('/chat');
  await expect(page.locator('text=Console locked')).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.locator('text=Premium features locked')).toBeVisible();
});
