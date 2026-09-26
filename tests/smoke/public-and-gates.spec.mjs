import { test, expect } from '@playwright/test';

for (const route of ['/', '/contact', '/pricing', '/admin/login', '/staff/login', '/portal/login']) {
  test(`public page loads: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();
  });
}

test('contact form is available without submitting data', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel(/Full Name/i).first()).toBeVisible();
  await expect(page.getByLabel(/Email Address/i).first()).toBeVisible();
});

for (const [name, route, loginPath] of [
  ['admin', '/admin', '/admin/login'],
  ['staff', '/staff/dashboard', '/staff/login'],
  ['portal', '/portal/dashboard', '/portal/login'],
]) {
  test(`unauthenticated ${name} route shows a gate`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'one gate check per route');
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect.poll(async () => {
      if (new URL(page.url()).pathname === loginPath) return true;
      return page.getByText(/access denied|sign-in required|no portal access|unauthenticated/i).first().isVisible().catch(() => false);
    }, { timeout: 20_000 }).toBe(true);
  });
}

test('contact page fits a mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');
  await page.goto('/contact');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
