import { test, expect } from '@playwright/test';

test('client surfaces reflect /api/me state', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.locator('text=Console locked')).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.locator('text=Premium features locked')).toBeVisible();
});
