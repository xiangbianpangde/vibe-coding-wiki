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
    const results = page.locator('#search-results .search-result');
    await expect(results.first()).toBeVisible();
  });

  test('search "vibe" returns multiple results', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    await page.locator('#search-input').fill('vibe');
    const results = page.locator('#search-results .search-result');
    await expect(results.first()).toBeVisible();
    await expect.poll(() => results.count()).toBeGreaterThanOrEqual(3);
  });

  test('empty search shows no results', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    // Empty input -> results cleared (auto-retry settles any transient render)
    const results = page.locator('#search-results .search-result');
    await expect(results).toHaveCount(0);
  });

  test('Enter on single result navigates to term page', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    // 'claude-code' should be unique-ish
    await page.locator('#search-input').fill('claude-code');
    // Enter is a silent no-op until results render — wait for the first result
    await expect(page.locator('#search-results .search-result').first()).toBeVisible();
    await page.locator('#search-input').press('Enter');
    await expect(page).toHaveURL(/claude-code/);
  });

  test('Escape closes modal', async ({ page }) => {
    await page.goto('/index.html');
    await page.keyboard.press('Meta+k');
    await expect(page.locator('#search-modal')).toHaveClass(/open/);
    // Escape handler lives on the input's keydown — wait for the async focus first
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('search-input');
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal')).not.toHaveClass(/open/);
  });
});
