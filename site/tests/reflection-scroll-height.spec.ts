import { test, expect } from '@playwright/test';
import { readPerson, reflect } from './record-helpers';

test('reflection has no inner scrollbar and a fitting form has no page scroll range', async ({page}) => {
  await page.setViewportSize({width:1470,height:733});
  await readPerson(page,'Liz Smith','relationships');
  await reflect(page);
  const body = page.locator('.journey-reflection:visible .reflection-body');
  expect(await body.evaluate(node => getComputedStyle(node).overflowY)).toBe('visible');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(2);
  await page.setViewportSize({width:390,height:600});
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeGreaterThan(100);
  expect(await body.evaluate(node => getComputedStyle(node).overflowY)).toBe('visible');
});
