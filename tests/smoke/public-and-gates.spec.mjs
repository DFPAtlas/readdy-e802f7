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
      return page.getByRole('heading', { name: /sign[ -]in required|access denied|no portal access/i }).isVisible().catch(() => false);
    }, { timeout: 20_000 }).toBe(true);
  });
}

test('contact page fits a mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');
  await page.goto('/contact');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

for (const choice of ['none', 'reject', 'accept']) {
  test(`analytics respects ${choice} consent`, async ({ page }) => {
    const requests = [];
    await page.route(/https:\/\/(www\.)?(googletagmanager\.com|.*google-analytics\.com)\//, async route => {
      requests.push(route.request().url());
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    });
    await page.goto('/contact');
    const banner = page.getByRole('dialog', { name: 'Cookie consent' });
    await expect(banner).toBeVisible();
    expect(requests).toHaveLength(0);
    if (choice === 'none') return;
    await banner.getByRole('button', { name: choice === 'reject' ? 'Reject Non-Essential' : 'Accept All', exact: true }).click();
    await expect(banner).not.toBeVisible();
    if (choice === 'accept') {
      await expect.poll(() => requests.length).toBeGreaterThan(0);
      await page.goto('/cookie-preferences');
      await page.getByRole('button', { name: /withdraw/i }).click();
      await expect.poll(() => page.evaluate(() => window['ga-disable-G-ZC4Y8SMRR7'])).toBe(true);
    }
    requests.length = 0;
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    expect(requests).toHaveLength(0);
  });
}

test('social preview image is generated', async ({ request }) => {
  const response = await request.get('/opengraph-image');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('UAT No choices survive autosave and reload', async ({ page }) => {
  await page.goto('/uat-testing/apply');
  await page.getByRole('dialog', { name: 'Cookie consent' }).getByRole('button', { name: 'Reject Non-Essential', exact: true }).click();
  await page.evaluate(() => localStorage.setItem('uat_application_draft', JSON.stringify({
    step: 6,
    data: { accessibilityInterest: 'Yes', accessibilityCapabilities: ['Screen readers'], accessibilityTools: 'Test tool', projectConflictStatus: 'Yes', projectConflictDetails: 'Test conflict' },
  })));
  await page.reload();
  const accessibility = page.getByRole('heading', { name: 'Accessibility Testing', exact: true }).locator('..');
  const conflicts = page.getByRole('heading', { name: 'Project Conflicts', exact: true }).locator('..');
  await accessibility.getByRole('button', { name: 'No', exact: true }).click();
  await expect(accessibility.getByRole('button', { name: 'No', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await conflicts.getByRole('button', { name: 'No', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('uat_application_draft')).data.projectConflictStatus)).toBe('No');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('uat_application_draft')).data);
  expect(saved).toMatchObject({ accessibilityInterest: 'No', accessibilityCapabilities: [], accessibilityTools: '', projectConflictStatus: 'No', projectConflictDetails: '' });
  await page.reload();
  await expect(accessibility.getByRole('button', { name: 'No', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(conflicts.getByRole('button', { name: 'No', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
