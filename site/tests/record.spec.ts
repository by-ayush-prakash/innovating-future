import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const recordPath = '/work/coexisting-with-ai/record/explore/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cif-record-first-journey-v1', JSON.stringify({ completed: true, question: 'understanding', route: 'landscape' }));
  });
});

test('primary routes resolve and the sitemap contains only canonical Record routes', async ({ page, request }) => {
  for (const path of ['/', '/work/', '/work/coexisting-with-ai/', '/work/coexisting-with-ai/record/', recordPath, '/contact/']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/work/coexisting-with-ai/record/explore');
  expect(sitemap).not.toContain('/work/coexisting-with-ai/atlas');
  expect(sitemap).not.toContain('/work/ai-native-generation');

  await page.goto(recordPath);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/work\/coexisting-with-ai\/record\/explore$/);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test('Follow, profiles, Compare, About, and browser Back restore the correct view', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=governance`);
  await expect(page.getByRole('button', { name: 'Follow', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Follow', exact: true }).click();
  await expect(page).toHaveURL(/view=follow/);
  await expect(page.locator('[data-people-view]')).toBeVisible();

  const nick = page.locator('[data-open-person="nick-nadeau"]');
  await expect(nick).toBeVisible();
  await nick.click();
  await expect(page).toHaveURL(/person=nick-nadeau/);
  await expect(page.locator('[data-person-view="nick-nadeau"]')).toBeVisible();

  await page.goBack();
  await expect(page.locator('[data-people-view]')).toBeVisible();

  await page.getByRole('button', { name: 'Compare', exact: true }).click();
  await expect(page).toHaveURL(/view=compare/);
  await expect(page.locator('[data-comparison-view]')).toBeVisible();

  await page.getByRole('button', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/view=about/);
  await expect(page.getByRole('heading', { name: 'About this Record.' })).toBeVisible();

  await page.goBack();
  await expect(page.locator('[data-comparison-view]')).toBeVisible();
});

test('source panels have durable URLs and Back closes the source', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  const source = page.locator('[data-view="evidence"] [data-open-direct]:visible').first();
  await expect(source).toBeVisible();
  await source.click();
  await expect(page).toHaveURL(/evidence=/);
  await expect(page.locator('[data-inspector]')).toHaveClass(/open/);
  await expect(page.getByRole('button', { name: /Listen to the context/ })).toBeVisible();

  await page.goBack();
  await expect(page).not.toHaveURL(/evidence=/);
  await expect(page.locator('[data-inspector]')).not.toHaveClass(/open/);
});

test('every published position has a recording and audio sources open at the cited moment', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const evidence = page.locator('[data-evidence]');
  const sources = await evidence.evaluateAll((items) => items.map((item) => ({
    video: (item as HTMLElement).dataset.video,
  })));
  expect(sources.filter(({ video }) => !video)).toEqual([]);

  const audioEvidence = page.locator('[data-view="understanding"] [data-evidence][data-video^="https://anchor.fm"]').first();
  const audioKey = await audioEvidence.getAttribute('data-evidence-key');
  expect(audioKey).toBeTruthy();
  await page.locator('[data-view="understanding"] [data-show-all-positions]:visible').click();
  const audioSource = page.locator(`.all-position-card[data-open-evidence-key="${audioKey}"]`);
  await expect(audioSource).toBeVisible();
  await audioSource.click();
  await page.getByRole('button', { name: /Listen to the context/ }).click();
  const audio = page.locator('[data-inspector-audio]');
  await expect(audio).toBeVisible();
  await expect(audio).toHaveAttribute('src', /^https:\/\/anchor\.fm\//);
  await expect(page.locator('[data-inspector-frame]')).toBeHidden();
});

test('public forms have spam traps and preserve submissions for review', async ({ page }) => {
  await page.goto('/work/coexisting-with-ai/record/');
  const landingUpdates = page.locator('form[name="coexistence-record-updates"]');
  await expect(landingUpdates).toHaveAttribute('data-netlify-honeypot', 'bot-field');
  await landingUpdates.getByLabel('Email address').fill('reader@example.com');
  await landingUpdates.getByRole('button', { name: 'Notify me' }).click();
  await expect(landingUpdates.locator('[data-report-signup-status]')).toHaveText('Subscription will activate on the published site.');

  await page.goto(`${recordPath}?view=contribute&question=privacy`);
  const suggestion = page.locator('form[name="coexistence-record-suggestions"]');
  const updates = page.locator('form[name="coexistence-record-question-updates"]');
  await expect(suggestion).toHaveAttribute('data-netlify-honeypot', 'bot-field');
  await expect(suggestion.locator('input[name="bot-field"]')).toHaveCount(1);
  await expect(updates.locator('input[name="bot-field"]')).toHaveCount(1);

  await suggestion.locator('.contribution-types label', { hasText: 'Source' }).click();
  await expect(suggestion.getByLabel('Source')).toBeChecked();
  await suggestion.getByLabel('Your suggestion').fill('A source to review');
  await suggestion.getByRole('button', { name: /Send suggestion/ }).click();
  await expect(suggestion.locator('[data-contribution-status]')).toHaveText('This will submit on the published site.');

  await page.getByRole('button', { name: /Follow this question/ }).first().click();
  await updates.getByLabel('Email address').fill('reader@example.com');
  await updates.getByRole('button', { name: /Follow this question/ }).click();
  await expect(updates.locator('[data-contribution-status]')).toHaveText('This will submit on the published site.');
});

test('reflection data can be exported and reset locally', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  await page.locator('[data-view="understanding"] [data-stance="more"]:visible').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-view="understanding"] [data-export-reflections]:visible').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^co-existence-record-reflections-\d{4}-\d{2}-\d{2}\.json$/);

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-view="understanding"] [data-reset-reflection]:visible').click();
  await page.waitForLoadState('domcontentloaded');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('cif-inquiry-trail-v1') || '{}'));
  expect(stored.understanding).toBeUndefined();
});

test('mobile question switching and Follow remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  await page.locator('[data-view="understanding"] [data-change-question]:visible').click();
  const learning = page.locator('[data-question="learning"]:visible');
  await expect(learning).toBeVisible();
  await learning.click();
  await expect(page).toHaveURL(/question=learning/);
  await expect(page.locator('[data-view="learning"]')).toBeVisible();

  await page.getByRole('button', { name: 'Follow', exact: true }).click();
  await expect(page).toHaveURL(/view=follow/);
  await expect(page.locator('[data-people-view]')).toBeVisible();
});

test('Record entry and application have no serious or critical accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/work/coexisting-with-ai/record/', `${recordPath}?view=explore&question=understanding`]) {
    await page.goto(path);
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  }
});
