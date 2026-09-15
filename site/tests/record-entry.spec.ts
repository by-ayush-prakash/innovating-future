import { test, expect } from '@playwright/test';
for (const id of ['evidence', 'learning', 'understanding', 'judgment']) {
 test(`question entry and refresh use one screen: ${id}`, async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`/work/coexisting-with-ai/record/explore/?question=${id}`);
  await expect(page.locator('.initial-perspective-picker:visible')).toHaveCount(1);
  await expect(page.locator('[data-reveal-views],.question-conversation-art,.explore-section-rail')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.initial-perspective-picker:visible')).toHaveCount(1);
  await expect(page.locator('.journey-screen-steps button')).toHaveCount(2);
  await expect(page.locator('.welcome-back')).toHaveCount(0);
  await page.goto('/work/coexisting-with-ai/record/explore/');
  await expect(page.locator('.explore-welcome')).toBeVisible();
  await page.locator(`.welcome-card--${id}`).click();
  await expect(page.locator(`.question-view[data-view="${id}"] .initial-perspective-picker`)).toBeVisible();
  await page.goBack();
  await expect(page.locator('.explore-welcome')).toBeVisible();
  expect(errors).toEqual([]);
 });
}
