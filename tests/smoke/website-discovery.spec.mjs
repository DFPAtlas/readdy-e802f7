import { test, expect } from '@playwright/test';

const wizardPath = '/services/websites-saas/plan-your-website';
const draftKey = 'dfp-website-discovery-v1';

async function openWizard(page) {
  // No test may submit to a live backend or send an email.
  await page.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(wizardPath);
  await page.getByRole('dialog', { name: 'Cookie consent' }).getByRole('button', { name: 'Reject Non-Essential', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Brand Vibe & Personality', exact: true })).toBeVisible();
}

test('website service links to a wizard that saves, reviews and edits the vision', async ({ page }) => {
  await page.goto('/services/websites-saas');
  const start = page.getByRole('link', { name: 'Plan Your Website', exact: true });
  await expect(start).toHaveCount(2);
  await expect(start.first()).toHaveAttribute('href', wizardPath);
  await openWizard(page);
  await page.getByRole('button', { name: 'Cosy and welcoming', exact: true }).click();
  await page.locator('#answer-2').fill('Clear, calm, trustworthy');
  await page.getByRole('button', { name: 'Next part', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Visuals, Layout & Feel', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cosy and welcoming', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#answer-2')).toHaveValue('Clear, calm, trustworthy');
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Next part', exact: true }).click();
  await page.locator('#answer-26').fill('More enquiries and a website I am proud of.');
  await page.getByRole('button', { name: 'Review my brief', exact: true }).click();
  await expect(page.getByText('More enquiries and a website I am proud of.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Brand Vibe & Personality', exact: true }).click();
  await expect(page.locator('#answer-2')).toHaveValue('Clear, calm, trustworthy');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('submission failure retains answers; retry sends the full brief once and clears its draft', async ({ page }) => {
  await openWizard(page);
  let requests = 0;
  let payload;
  let notifications = 0;
  await page.route('**/rest/v1/rpc/submit_project_submission', async (route) => {
    requests++;
    payload = route.request().postDataJSON().p_payload;
    await route.fulfill(requests === 1
      ? { status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Submission unavailable', code: 'XX000' }) }
      : { status: 200, contentType: 'application/json', body: JSON.stringify('12345678-1234-4234-8234-123456789abc') });
  });
  await page.route('**/functions/v1/send-lead-notification', async (route) => {
    notifications++;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  for (let part = 0; part < 6; part++) {
    for (const field of await page.locator('main textarea').all()) {
      const id = (await field.getAttribute('id')).replace('answer-', '');
      await field.fill(`Vision answer ${id}`);
    }
    await page.getByRole('button', { name: part === 5 ? 'Review my brief' : 'Next part', exact: true }).click();
  }
  await expect(page.getByText('26 of 26 questions answered', { exact: true })).toBeVisible();
  await page.getByLabel('Your name (required)').fill('Discovery Test');
  await page.getByLabel('Email address (required)').fill('discovery@example.com');
  await page.getByLabel('Business name (optional)').fill('Example Ltd');
  await page.locator('main input[type="checkbox"]').check();
  await page.getByRole('button', { name: 'Send my website brief', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Submission unavailable');
  await expect(page.getByText('Your vision is in good hands.', { exact: true })).toHaveCount(0);
  const draft = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), draftKey);
  expect(draft.answers['26'].text).toBe('Vision answer 26');
  expect(JSON.stringify(draft)).not.toContain('discovery@example.com');
  await page.getByRole('button', { name: 'Send my website brief', exact: true }).dblclick();
  await expect(page.getByRole('heading', { name: 'Your vision is in good hands.', exact: true })).toBeVisible();
  expect(requests).toBe(2);
  expect(payload.name).toBe('Discovery Test');
  for (let i = 1; i <= 26; i++) expect(payload.additional_notes).toContain(`Vision answer ${i}`);
  await expect.poll(() => notifications).toBe(1);
  await expect(page.getByText('DFP-PB-12345678', { exact: true })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), draftKey)).toBeNull();
});

test('wizard remains usable when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
  });
  await openWizard(page);
  await expect(page.getByRole('status')).toContainText('Auto-save is unavailable');
  await page.locator('#answer-2').fill('Friendly, helpful, clear');
  await page.getByRole('button', { name: 'Next part', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('#answer-2')).toHaveValue('Friendly, helpful, clear');
});
