// E2E: home page basic rendering + key cards
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with HTTP 200', async ({ page }) => {
    const res = await page.goto('/index.html');
    expect(res?.status()).toBe(200);
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Vibe Coding Wiki/i);
  });

  test('hero section is visible with metrics', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.hero__title')).toBeVisible();
    const metrics = await page.locator('.metric__value').allTextContents();
    expect(metrics.length).toBeGreaterThanOrEqual(3);
  });

  test('layer cards (L1-L8) all present', async ({ page }) => {
    await page.goto('/index.html');
    const layerCards = await page.locator('.layer-card').count();
    expect(layerCards).toBeGreaterThanOrEqual(8);
  });

  test('topnav links navigate correctly', async ({ page }) => {
    await page.goto('/index.html');
    // Click "词条 A-Z" link
    await page.click('a[href="pages/glossary.html"]');
    await expect(page).toHaveURL(/glossary\.html/);
  });

  test('has og:image meta tag', async ({ page }) => {
    await page.goto('/index.html');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https?:\/\/.*og-image\.svg$/);
  });
});
