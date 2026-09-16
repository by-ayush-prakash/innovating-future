import {test,expect} from '@playwright/test';
test('cards fade into content without an expanding panel and return cleanly',async({page})=>{
 await page.goto('/work/coexisting-with-ai/record/explore/');
 await page.locator('.welcome-card--evidence').click();
 await expect(page.locator('.record-card-opening')).toHaveCount(0);
 await expect.poll(async()=>page.locator('.explore-welcome').evaluate(el=>Number(getComputedStyle(el).opacity))).toBeLessThan(1);
 await page.screenshot({path:'/private/tmp/cif-card-opening.png'});
 await expect(page.locator('.record-card-opening')).toHaveCount(0);
 await expect(page.locator('.journey-screen-picker:visible')).toBeVisible();
 await page.screenshot({path:'/private/tmp/cif-card-opened.png'});
 await page.goBack();
 await expect(page.locator('.explore-welcome')).toBeVisible();
 await expect(page.locator('.record-card-opening')).toHaveCount(0);
 await page.locator('.welcome-card--learning').click();
 await expect(page.locator('.record-card-opening')).toHaveCount(0);
 await expect(page.locator('.journey-screen-picker:visible')).toBeVisible();
});
