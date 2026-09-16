import { test, expect } from '@playwright/test';
import { recordPath } from './record-helpers';

test('comparison menus, selections and recordings retain the scroll position', async ({page}) => {
  await page.setViewportSize({width:1280, height:600});
  await page.goto(recordPath + '?view=compare&question=evidence&compare=Maya%20Ackerman%7CNick%20Nadeau');
  await page.evaluate(() => window.scrollTo(0, 150));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(150);
  for (const selector of ['[data-person-toggle="b"]', '[data-person-choice="b"]:not([hidden])']) {
    if (selector.includes('choice')) {
      await page.locator('[data-person-choice="b"]').nth(2).evaluate((node: HTMLElement) => node.click());
    } else await page.locator(selector).evaluate((node: HTMLElement) => node.click());
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(150);
  }
  await page.locator('.compare-question-strip > summary').evaluate((node: HTMLElement) => node.click());
  await page.locator('[data-compare-question="learning"]').evaluate((node: HTMLElement) => node.click());
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(150);
  await page.locator('[data-compare-row]:visible [data-compare-source]:visible').first().evaluate((node: HTMLElement) => node.click());
  await page.getByRole('button', {name:'Close recording'}).evaluate((node: HTMLElement) => node.click());
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(150);
});

test('opening a person from Follow does not reset the page to the top', async ({page}) => {
  await page.setViewportSize({width:1280,height:500});
  await page.goto(recordPath + '?view=follow');
  await expect(page.locator('[data-people-view]')).toBeVisible();
  await page.locator('[data-people-group] > summary').first().click();
  await page.evaluate(() => window.scrollTo(0, 120));
  await page.locator('[data-open-person]').first().evaluate((node: HTMLElement) => node.click());
  await expect(page.locator('[data-person-view]:visible')).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(120);
});
