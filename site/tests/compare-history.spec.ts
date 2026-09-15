import { test, expect } from '@playwright/test';
import { recordPath } from './record-helpers';

test('Compare controls remain usable through repeated Back and Forward including the opening page', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(recordPath);
  await page.locator('[data-show-compare]').click();
  const initialHistory = await page.evaluate(() => history.length);
  await page.locator('[data-compare-question="evidence"]').click();
  expect(await page.evaluate(() => history.length)).toBe(initialHistory + 1);
  await page.locator('[data-person-toggle="b"]').click();
  await page.locator('[data-person-choice="b"]:visible').nth(2).click();
  const selectedUrl = page.url();
  const selectedPerson = await page.locator('[data-person-name="b"]').textContent();
  for (let cycle = 0; cycle < 5; cycle++) {
    await page.goBack();
    await page.goBack();
    await expect(page.locator('[data-compare-question].active')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('.explore-welcome')).toBeVisible();
    await page.goForward();
    await page.goForward();
    await page.goForward();
    await expect(page).toHaveURL(selectedUrl);
    await expect(page.locator('[data-person-name="b"]')).toHaveText(selectedPerson || '');
    await page.locator('[data-person-toggle="b"]').click();
    await expect(page.locator('[data-person-menu="b"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('.compare-question-strip > summary').click();
    await expect(page.locator('[data-compare-question="learning"]')).toBeVisible();
    await page.locator('.compare-question-strip > summary').click();
  }
  await page.locator('.compare-question-strip > summary').click();
  await page.locator('[data-compare-question="learning"]').click();
  await expect(page).toHaveURL(/question=learning/);
  await expect(page.locator('[data-compare-row]:visible')).toHaveAttribute('data-compare-row','learning');
  expect(errors).toEqual([]);
});

test('Compare sources open in place and close without changing the comparison', async ({page}) => {
  await page.goto(recordPath + '?view=compare&question=evidence&compare=' + encodeURIComponent('Maya Ackerman|Nick Nadeau'));
  const comparisonUrl = page.url();
  for (const [side, speaker, media] of [['a','Maya Ackerman','iframe'],['b','Nick Nadeau','audio']] as const) {
    await page.locator(`[data-compare-row]:visible [data-compare-side="${side}"] [data-compare-source]:visible`).first().click();
    const dialog = page.getByRole('dialog', {name:'Original conversation'});
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(speaker);
    await expect(dialog.locator(media)).toHaveCount(1);
    await expect(page).toHaveURL(comparisonUrl);
    await dialog.getByRole('button',{name:'Close recording'}).click();
    await expect(dialog).not.toBeVisible();
    await expect(dialog.locator('iframe,audio')).toHaveCount(0);
    await expect(page.locator('[data-comparison-view]')).toBeVisible();
  }
  await page.locator('[data-person-toggle="b"]').click();
  await expect(page.locator('[data-person-menu="b"]')).toBeVisible();
});
