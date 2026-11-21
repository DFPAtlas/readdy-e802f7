import { test, expect } from '@playwright/test';

for (const route of ['/', '/contact', '/privacy', '/partners/referrals', '/products/quickguard', '/services/ai-automation', '/services/websites-saas/plan-your-website', '/request-demo']) {
  test(`canonical and social metadata: ${route}`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'response metadata is viewport independent');
    const response = await request.get(`${route}?utm_source=repair-test`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const canonical = html.match(/rel="canonical" href="([^"]+)"/);
    expect(canonical).not.toBeNull();
    const url = new URL(canonical[1]);
    expect(url.origin).toBe('https://digital-footprint.uk');
    expect(url.pathname).toBe(route);
    expect(url.search).toBe('');
    expect(html).toContain('https://digital-footprint.uk/og-image.png');
  });
}

for (const route of ['/login', '/admin/login', '/staff/login', '/portal/login', '/uat/login', '/account/help', '/uat-testing/track']) {
  test(`noindex metadata: ${route}`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'response metadata is viewport independent');
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(/name="robots" content="noindex, nofollow"/);
    expect(html).not.toContain('name="googlebot" content="index, follow');
  });
}

test('missing routes return real 404 responses', async ({ request }) => {
  expect((await request.get('/audit-repair-nonexistent-20261121')).status()).toBe(404);
});
test('the static social image has a valid PNG header and 1200 by 630 dimensions', async ({ request }) => {
  const response = await request.get('/og-image.png');
  expect(response.headers()['content-type']).toContain('image/png');
  const bytes = await response.body();
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(1200); expect(bytes.readUInt32BE(20)).toBe(630);
});
test('preferred-host redirect preserves path and query', async ({ request }) => {
  const response = await request.get('/contact?utm_source=host-test', { headers: { Host: 'www.digital-footprint.uk' }, maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('https://digital-footprint.uk/contact?utm_source=host-test');
});
test('sitemap includes key services and excludes login and completion routes', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const route of ['/pricing','/services/ai-automation','/services/cloud-infrastructure','/services/websites-saas/plan-your-website']) expect(xml).toContain(`https://digital-footprint.uk${route}</loc>`);
  expect(xml).not.toContain('/login</loc>'); expect(xml).not.toContain('/uat-testing/application-complete</loc>');
  expect(xml).not.toContain('<lastmod>');
});
test('homepage structured data is visible in the server response', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain('"@type":"Organization"');
});
test('a fabricated subscription return URL never claims an active subscription', async ({ page }) => {
  await page.route('**/functions/v1/dfp-subscription-checkout-status*', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"Checkout not found"}' }));
  await page.goto('/checkout/subscription-success?session_id=cs_test_fabricated');
  await expect(page.getByText('We could not confirm a subscription.', { exact: false })).toBeVisible();
  await expect(page.getByText('Subscription active', { exact: true })).toHaveCount(0);
});
