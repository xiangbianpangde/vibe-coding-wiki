// E2E: search modal flow (Cmd+K open → type → navigate)
import { test, expect } from '@playwright/test';

test.describe('Search modal', () => {
  test('Cmd+K opens search modal and focuses input', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    const modal = page.locator('#search-modal');
    await expect(modal).toHaveClass(/open/);
    // Focus is set asynchronously after open — poll instead of a single read
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('search-input');
  });

  test('Ctrl+K also opens modal (cross-platform)', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Control+k');
    const modal = page.locator('#search-modal');
    await expect(modal).toHaveClass(/open/);
  });

  test('typing "mcp" returns at least one result with .search-result', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    await page.locator('#search-input').fill('mcp');
    // Wait for input event handler
    await page.waitForTimeout(200);
    const results = page.locator('#search-results .search-result');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('search "vibe" returns multiple results', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    await page.locator('#search-input').fill('vibe');
    await page.waitForTimeout(200);
    const results = page.locator('#search-results .search-result');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('empty search shows no results', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    // Empty input -> results cleared
    await page.waitForTimeout(100);
    const results = page.locator('#search-results .search-result');
    const count = await results.count();
    expect(count).toBe(0);
  });

  test('Enter on single result navigates to term page', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    // 'claude-code' should be unique-ish
    await page.locator('#search-input').fill('claude-code');
    await page.waitForTimeout(200);
    await page.locator('#search-input').press('Enter');
    await expect(page).toHaveURL(/claude-code/);
  });

  test('Escape closes modal', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    await expect(page.locator('#search-modal')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal')).not.toHaveClass(/open/);
  });
});
