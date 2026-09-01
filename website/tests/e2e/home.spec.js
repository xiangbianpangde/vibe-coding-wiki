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
    // Responsive branch mirroring the CSS breakpoint (style.css @media
    // max-width: 960px): on mobile .topnav__links is display:none and the
    // injected .vc-nav-toggle (☰) hamburger is the real navigation path.
    // Both branches execute the same navigation semantics and assert the URL.
    const width = page.viewportSize()?.width ?? 1280;
    if (width <= 960) {
      // Mobile layout: open the hamburger menu first (js/nav.js)
      const toggle = page.locator('.vc-nav-toggle');
      await expect(toggle).toBeVisible();
      await toggle.click();
      // Menu expanded: .vc-nav-open restores display:flex on .topnav__links
      await expect(page.locator('.topnav__links')).toHaveClass(/vc-nav-open/);
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      // Click the same glossary link, scoped to the opened nav
      // (mobile.spec.js precedent; guards against future DOM reordering)
      await page.click('.topnav__links a[href="pages/glossary.html"]');
    } else {
      // Desktop layout: topnav links are directly clickable
      await page.click('a[href="pages/glossary.html"]');
    }
    await expect(page).toHaveURL(/glossary\.html/);
  });

  test('has og:image meta tag', async ({ page }) => {
    await page.goto('/index.html');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https?:\/\/.*og-image\.svg$/);
  });
});
