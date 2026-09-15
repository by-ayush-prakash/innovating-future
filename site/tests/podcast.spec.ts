import { expect, test } from '@playwright/test';

test('podcast Subscribe menu exposes every listening platform', async ({ page }) => {
  await page.goto('/podcast/');
  const menu = page.locator('[data-subscribe-menu]');
  const trigger = menu.locator('[data-subscribe-trigger]');
  const items = menu.locator('[data-subscribe-items]');

  await expect(trigger).toHaveText(/Subscribe/);
  const closedHeight = await page.locator('.ctab').evaluate((element) => element.getBoundingClientRect().height);
  await trigger.hover();
  await expect(items).toBeVisible();
  const openHeight = await page.locator('.ctab').evaluate((element) => element.getBoundingClientRect().height);
  expect(openHeight).toBe(closedHeight);
  await expect(menu.getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/@ayushprakashofficial');
  await expect(menu.getByRole('link', { name: 'Spotify' })).toHaveAttribute('href', 'https://open.spotify.com/show/1ILhje5HSua1FEOlTyFAhG');
  await expect(menu.getByRole('link', { name: 'Apple Podcasts' })).toHaveAttribute('href', 'https://podcasts.apple.com/ca/podcast/ayush-prakash-podcast/id1557703631');

  await page.mouse.move(0, 0);
  await expect(items).toBeHidden();

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(items).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(items).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('.ctab h2')).toBeVisible();
  await expect(page.locator('.ctab')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('episode catalogue uses a compact plus control to load more', async ({ page }) => {
  await page.goto('/podcast/');
  const loader = page.getByRole('button', { name: 'Load more episodes' });

  await expect(loader).toHaveText('+');
  await expect(page.locator('.eprow:visible')).toHaveCount(5);
  await expect(page.locator('.eprow:visible').last()).toHaveClass(/is-visible-last/);
  await loader.click();
  await expect(page.locator('.eprow:visible')).toHaveCount(15);
  await expect(page.locator('.eprow:visible').last()).toHaveClass(/is-visible-last/);
});

test('latest episode uses the custom featured-player layout', async ({ page }) => {
  await page.goto('/podcast/');
  const feature = page.locator('.latest-feature');
  await expect(feature.getByText('Latest episode')).toBeVisible();
  await expect(feature.locator('.latest-feature__art img')).toBeVisible();
  await expect(feature.getByRole('button', { name: 'Play latest episode' })).toBeVisible();
  await expect(feature.getByRole('slider', { name: 'Episode progress' })).toBeVisible();
});
