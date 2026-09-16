import { test, expect } from '@playwright/test';
import { recordPath } from './record-helpers';

test('deliberate comparison interactions animate and history restoration stays instant', async ({ page }) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    (window as any).motionEntries = [];
    Element.prototype.animate = function (...args) {
      (window as any).motionEntries.push(this.className);
      return animate.apply(this, args);
    };
  });
  await page.goto(recordPath);
  await page.locator('[data-show-compare]').click();
  await expect.poll(() => page.evaluate(() => (window as any).motionEntries.some((name: string) => name.includes('comparison-view')))).toBe(true);
  await page.locator('[data-compare-question="evidence"]').click();
  await page.locator('[data-person-toggle="b"]').click();
  await expect.poll(() => page.evaluate(() => (window as any).motionEntries.some((name: string) => name.includes('person-menu')))).toBe(true);
  await page.keyboard.press('Escape');
  await page.locator('[data-compare-row]:visible [data-compare-source]:visible').first().click();
  await expect.poll(() => page.evaluate(() => (window as any).motionEntries.includes('comparison-source-dialog'))).toBe(true);
  await page.getByRole('button', { name: 'Close recording' }).click();
  await page.evaluate(() => (window as any).motionEntries = []);
  await page.goBack();
  await expect(page.locator('[data-compare-question].active')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).motionEntries)).toEqual([]);
});

test('reduced motion suppresses deliberate entrance animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(recordPath);
  await page.locator('[data-show-compare]').click();
  await page.locator('[data-compare-question="evidence"]').click();
  await page.locator('[data-person-toggle="b"]').click();
  expect(await page.locator('[data-person-menu="b"]').evaluate(node => node.getAnimations().length)).toBe(0);
});
