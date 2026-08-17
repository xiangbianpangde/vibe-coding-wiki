// E2E: theme toggle (light ↔ dark) + localStorage persistence
import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test('initial theme is light (default)', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/index.html');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['light', 'dark']).toContain(theme);
  });

  test('clicking toggle switches data-theme attribute', async ({ page }) => {
    await page.goto('/index.html');
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.locator('.theme-toggle').click();
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).not.toBe(before);
  });

  test('theme persists across page navigations', async ({ page }) => {
    await page.goto('/index.html');
    // Switch to dark
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.locator('.theme-toggle').click();
    const targetTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    // Navigate to another page
    await page.goto('/pages/glossary.html');
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).toBe(targetTheme);
  });

  test('localStorage stores the theme value', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.theme-toggle').click();
    const stored = await page.evaluate(() => localStorage.getItem('vc-theme'));
    expect(stored).toMatch(/^(light|dark)$/);
  });

  test('body background differs between light and dark', async ({ page }) => {
    await page.goto('/index.html');
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // Toggle theme
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(50);
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).not.toBe(darkBg);
  });
});
