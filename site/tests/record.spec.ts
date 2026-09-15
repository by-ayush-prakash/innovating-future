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
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/work\/coexisting-with-ai\/record\/explore$/);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('.topbar .record-wordmark')).toHaveCount(0);
});

test('the public Record scrolls as a document', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  const before = await page.evaluate(() => ({
    viewport: document.documentElement.clientHeight,
    content: document.documentElement.scrollHeight,
    top: document.documentElement.scrollTop,
  }));
  expect(before.content).toBeGreaterThan(before.viewport);

  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollTop)).toBeGreaterThan(before.top);
});

test('question heroes keep the approved question-only opening', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  const heroes = page.locator('[data-view] > .public-question-intro');
  await expect(heroes).toHaveCount(10);
  for (const hero of await heroes.all()) {
    await expect(hero.locator(':scope > p')).toHaveCount(0);
    await expect(hero.locator('[data-reveal-views]')).toHaveText('Let’s explore ↓');
  }

  const selector = page.locator('[data-view="understanding"] .question-title-selector');
  await selector.focus();
  await expect(selector.locator(':scope > i')).toBeVisible();
  expect(await selector.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('none');
});

test('Follow, profiles, Compare, About, and browser Back restore the correct view', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=governance`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
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

  const compareGeometry = await page.evaluate(() => {
    const rect = (selector: string) => document.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
    const pickerA = rect('.person-picker--a > [data-person-toggle]');
    const pickerB = rect('.person-picker--b > [data-person-toggle]');
    const sideA = rect('.comparison-row:not([hidden]) .comparison-side--a');
    const sideB = rect('.comparison-row:not([hidden]) .comparison-side--b');
    return { pickerA, pickerB, sideA, sideB };
  });
  expect(compareGeometry.pickerA).toBeTruthy();
  expect(compareGeometry.pickerB).toBeTruthy();
  expect(compareGeometry.sideA).toBeTruthy();
  expect(compareGeometry.sideB).toBeTruthy();
  expect(Math.abs(compareGeometry.pickerA!.x - compareGeometry.sideA!.x)).toBeLessThan(2);
  expect(Math.abs(compareGeometry.pickerB!.x - compareGeometry.sideB!.x)).toBeLessThan(2);
  expect(Math.abs(compareGeometry.pickerA!.width - compareGeometry.sideA!.width)).toBeLessThan(2);
  expect(Math.abs(compareGeometry.pickerB!.width - compareGeometry.sideB!.width)).toBeLessThan(2);

  await page.getByRole('button', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/view=about/);
  await expect(page.getByRole('heading', { name: 'About this Record.' })).toBeVisible();
  const aboutBounds = await page.locator('[data-about-view]').boundingBox();
  expect(aboutBounds?.x).toBeLessThan(1);
  expect(Math.abs((aboutBounds?.width ?? 0) - page.viewportSize()!.width)).toBeLessThan(1);
  await expect(page.getByText('Support the Record', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/No payment link is active/i)).toHaveCount(0);

  await page.goBack();
  await expect(page.locator('[data-comparison-view]')).toBeVisible();
});

test('the in-page comparison button opens Compare at the top', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await page.locator('[data-view="evidence"] [data-explore-compare]:visible').click();

  await expect(page).toHaveURL(/view=compare/);
  await expect(page.locator('[data-comparison-view]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('source panels have durable URLs and Back closes the source', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  const source = page.locator('[data-view="evidence"] [data-open-direct]:visible').first();
  await expect(source).toBeVisible();
  await source.click();
  await expect(page).toHaveURL(/journey=/);
  await expect(page.locator('.record-perspective:visible')).toBeVisible();
  await expect(page.locator('[data-context-toggle]')).toBeVisible();

  await page.goBack();
  await expect(page).not.toHaveURL(/journey=/);
  await expect(page.locator('.record-perspective:visible')).toHaveCount(0);
});

test('every published position has a recording and audio sources open at the cited moment', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  const evidence = page.locator('[data-evidence]');
  const sources = await evidence.evaluateAll((items) => items.map((item) => ({
    video: (item as HTMLElement).dataset.video,
  })));
  expect(sources.filter(({ video }) => !video)).toEqual([]);

  const audioEvidence = page.locator('[data-view="understanding"] [data-evidence][data-video^="https://anchor.fm"]').first();
  const audioKey = await audioEvidence.getAttribute('data-evidence-key');
  expect(audioKey).toBeTruthy();
  await page.goto(`${recordPath}?view=explore&question=understanding&evidence=${encodeURIComponent(audioKey!)}`);
  await page.locator('[data-context-toggle]').click();await page.locator('[data-inspector-video]').click();
  const audio = page.locator('[data-inspector-audio]');
  await expect(audio).toBeVisible();
  await expect(audio).toHaveAttribute('src', /^https:\/\/anchor\.fm\//);
  await expect(page.locator('.record-perspective iframe')).toHaveCount(0);
});

test('public forms have spam traps and preserve submissions for review', async ({ page }) => {
  await page.goto('/work/coexisting-with-ai/record/');
  const landingUpdates = page.locator('form[name="coexistence-record-updates"]');
  await expect(landingUpdates).toHaveAttribute('data-netlify-honeypot', 'bot-field');
  await landingUpdates.getByLabel('Email address').fill('reader@example.com');
  await landingUpdates.getByRole('button', { name: 'Notify me' }).click();
  await expect(landingUpdates.locator('[data-report-signup-status]')).toHaveText('Subscription will activate on the published site.');

  await page.goto(`${recordPath}?view=contribute&question=privacy`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
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
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  await page.locator('[data-view="understanding"] [data-reveal-reflection]').click();
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
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  await page.locator('[data-view="understanding"] [data-change-question]:visible').click();
  await expect(page.locator('[data-question-panel]')).toBeVisible();
  await page.locator('[data-question-backdrop]').dispatchEvent('pointerdown');
  await expect(page.locator('[data-question-panel]')).toBeHidden();

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

test('question search filters visibly, clears, and opens a result', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
  await page.locator('[data-view="understanding"] [data-change-question]:visible').click();

  const panel = page.locator('[data-question-panel]');
  const search = page.getByPlaceholder('Search questions, people, or ideas');
  const results = page.locator('[data-search-results]');
  const questionList = panel.getByRole('navigation', { name: 'Research questions' });

  await search.fill('t');
  await expect(panel).toHaveClass(/searching/);
  await expect(results).toBeVisible();
  await expect(results.getByRole('button').first()).toBeVisible();
  await expect(questionList).toBeHidden();

  await search.fill('no-result-phrase');
  await expect(results).toContainText('No matches for “no-result-phrase”.');

  await search.fill('');
  await expect(results).toBeHidden();
  await expect(questionList).toBeVisible();

  await search.fill('trust');
  const trust = results.getByRole('button', { name: /When should we trust an AI answer/ }).first();
  await expect(trust).toBeVisible();
  await trust.click();
  await expect(page).toHaveURL(/question=evidence/);
  await expect(panel).toBeHidden();
});

test('Record entry and application have no serious or critical accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/work/coexisting-with-ai/record/', `${recordPath}?view=explore&question=understanding`]) {
    await page.goto(path);
  const startViews = page.locator('[data-reveal-views]:visible');
  if (await startViews.count()) await startViews.click();
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  }
});

test('Explore reveals views, context and reflection only when requested', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const view = page.locator('[data-view="understanding"]');
  await expect(view.locator('[data-reveal-views]')).toBeVisible();
  for (const selector of ['.explore-starters','.explore-question-context','.explore-lenses','.explore-focus','.explore-reflection']) {
    await expect(view.locator(selector)).toBeHidden();
  }
  await view.locator('[data-reveal-views]').click();
  await expect(view.locator('.explore-starters')).toBeVisible();
  await expect(view.locator('.explore-question-context')).toBeHidden();
  await expect(view.locator('.explore-reflection')).toBeHidden();
  await view.locator('[data-reveal-context]').click();
  await expect(view.locator('.explore-question-context')).toBeVisible();
  await view.locator('[data-reveal-context]').click();
  await expect(view.locator('.explore-question-context')).toBeHidden();
  await view.locator('[data-reveal-reflection]').click();
  await expect(view.locator('.explore-reflection')).toBeVisible();
  await page.getByRole('button', {name:'Follow',exact:true}).click();
  await page.goBack();
  await expect(view.locator('.explore-starters')).toBeVisible();
});

test('refresh never renders the retired gateway, even before scripts start', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of [recordPath, `${recordPath}?view=explore&question=understanding`]) {
    await page.goto(path);
    await expect(page.locator('.journey-onboarding')).toHaveCount(0);
    await expect(page.locator('.workspace')).not.toHaveClass(/journey-pending/);
    await expect(page.locator('[data-view="understanding"] [data-reveal-views]')).toBeVisible();
    await expect(page.locator('head link[href="/styles/record-interface-v2.css"]')).toHaveCount(1);
    await page.reload();
    await expect(page.getByText('Choose your path.', {exact:true})).toHaveCount(0);
  }
  await context.close();
});

test('question panel animates closed and supports immediate reopening', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const trigger = page.locator('.question-view:visible [data-change-question]');
  const panel = page.locator('[data-question-panel]');
  await trigger.click();
  const closing = await page.evaluate(() => {
    (document.querySelector('[data-close-menu]') as HTMLButtonElement).click();
    const panel = document.querySelector('[data-question-panel]') as HTMLElement;
    return { hidden: panel.hidden, inert: panel.inert, running: panel.getAnimations().some(a => a.playState === 'running') };
  });
  expect(closing).toEqual({ hidden: false, inert: true, running: true });
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute('inert', '');
  await page.locator('[data-close-menu]').click();
  await expect(panel).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trigger.click();
  await page.locator('[data-close-menu]').click();
  await expect(panel).toBeHidden();
});

test('section dots follow jumps and manual scrolling', async ({ page }) => {
  await page.goto(`${recordPath}?view=explore&question=understanding`);
  const rail = page.locator('.question-view:visible .explore-section-rail');
  await expect(rail).toBeHidden();
  await page.getByRole('button', { name: 'Let’s explore', exact: true }).click();
  const question = rail.getByRole('button', { name: 'Go to question', exact: true });
  const positions = rail.getByRole('button', { name: 'Go to positions', exact: true });
  await expect(positions).toHaveAttribute('aria-current', 'location');
  await question.click();
  await expect(question).toHaveAttribute('aria-current', 'location');
  await expect(positions).not.toHaveAttribute('aria-current', 'location');
  await expect.poll(() => page.locator('.question-view:visible .public-question-intro').evaluate(e => e.getBoundingClientRect().top)).toBeGreaterThan(0);
  await positions.click();
  await expect(positions).toHaveAttribute('aria-current', 'location');
  await page.mouse.wheel(0, -1500);
  await expect(question).toHaveAttribute('aria-current', 'location');
});

test('refresh restores the selected question before application scripts load', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  await expect(page.locator('.question-view:visible')).toHaveAttribute('data-view', 'evidence');
  await expect(page.locator('[data-question].active')).toHaveAttribute('data-question', 'evidence');
  await page.reload();
  await expect(page.locator('.question-view:visible')).toHaveAttribute('data-view', 'evidence');
});
