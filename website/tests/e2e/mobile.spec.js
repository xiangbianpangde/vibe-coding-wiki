// E2E: mobile hamburger menu (< 768px)
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test.use({ ...devices['iPhone 14'] });

  test('hamburger button appears at mobile width', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.vc-nav-toggle')).toBeVisible();
  });

  test('hamburger toggles .vc-nav-open class on links', async ({ page }) => {
    await page.goto('/index.html');
    const links = page.locator('.topnav__links');
    // Initially no .vc-nav-open
    await expect(links).not.toHaveClass(/vc-nav-open/);
    // Click toggle
    await page.locator('.vc-nav-toggle').click();
    await expect(links).toHaveClass(/vc-nav-open/);
    // Click again closes
    await page.locator('.vc-nav-toggle').click();
    await expect(links).not.toHaveClass(/vc-nav-open/);
  });

  test('aria-expanded reflects toggle state', async ({ page }) => {
    await page.goto('/index.html');
    const toggle = page.locator('.vc-nav-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking a nav link closes the menu', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.vc-nav-toggle').click();
    await expect(page.locator('.topnav__links')).toHaveClass(/vc-nav-open/);
    // Click a nav link
    await page.locator('.topnav__links a[href="pages/glossary.html"]').click();
    await page.waitForURL(/glossary\.html/);
    // Menu should be closed
    await expect(page.locator('.topnav__links')).not.toHaveClass(/vc-nav-open/);
  });

  test('desktop width: hamburger does NOT appear', async ({ page }) => {
    // Override viewport to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');
    const visible = await page.locator('.vc-nav-toggle').isVisible().catch(() => false);
    expect(visible).toBe(false);
  });
});
