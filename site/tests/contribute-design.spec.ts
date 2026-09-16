import {test,expect} from '@playwright/test';
import {recordPath} from './record-helpers';
for(const width of [1470,390]) test(`illustrated contribution card at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto(recordPath+'?view=contribute');
 await expect(page.locator('[data-contribution-view]')).toBeVisible();
 await page.waitForTimeout(300);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 if(width===1470) expect(await page.locator('.contribution-card-content').evaluate(n=>n.scrollHeight-n.clientHeight)).toBeLessThanOrEqual(2);
 await page.screenshot({path:`/private/tmp/cif-contribute-${width}.png`,fullPage:true});
 await page.locator('[data-contribution-choice="follow"]').click();
 await expect(page.locator('[data-contribution-panel="follow"]')).toBeVisible();
 await page.locator('[data-contribution-choice="suggest"]').click();
 await expect(page.locator('[data-contribution-panel="suggest"]')).toBeVisible();
 await page.getByLabel('Your suggestion').fill('A source to consider');
 await page.locator('.contribution-details summary').click();
 await page.locator('.contribution-types label').filter({hasText:'Source'}).click();
 await expect(page.locator('[data-contribution-back]')).toHaveCount(0);
});
