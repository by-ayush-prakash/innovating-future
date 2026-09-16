import { test, expect } from '@playwright/test';
import { recordPath } from './record-helpers';
for (const width of [1470,390]) test(`Follow categories start closed and reveal their full roster at ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.goto(recordPath + '?view=follow');
  const groups = page.locator('[data-people-group]');
  await expect(groups).toHaveCount(4);
  await expect(page.locator('[data-people-group][open]')).toHaveCount(0);
  await expect(page.locator('[data-open-person]:visible')).toHaveCount(0);
  for (const group of await groups.all()) {
    await group.locator('summary').click();
    await expect(group).toHaveAttribute('open','');
    const total = await group.locator('[data-open-person]').count();
    await expect(group.locator('[data-open-person]:visible')).toHaveCount(total);
    await group.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(group).not.toHaveAttribute('open','');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
