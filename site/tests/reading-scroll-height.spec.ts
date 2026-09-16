import { test, expect } from '@playwright/test';
import { readPerson, contextMode, reader } from './record-helpers';

test('a fitting passage has no empty scroll range, including after reload', async ({page}) => {
  await page.setViewportSize({width:1470,height:733});
  await readPerson(page,'Ashleigh Rankin','relationships');
  for (let visit=0;visit<2;visit++) {
    await expect(page.locator(reader)).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(2);
    await page.mouse.wheel(0,400);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    if (!visit) await page.reload();
  }
  await contextMode(page,'read');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeGreaterThan(100);
});
