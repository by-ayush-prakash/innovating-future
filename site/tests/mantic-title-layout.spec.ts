import {test,expect} from '@playwright/test';
test('Mantic title and description form a balanced block',async({page})=>{
 await page.goto('/work/mantic/');const section=page.locator('#list');await section.scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const columns=page.locator('.mantic-title-layout > div');
 const left=await columns.nth(0).boundingBox(),right=await columns.nth(1).boundingBox();
 expect(Math.abs(left!.y+left!.height/2-right!.y-right!.height/2)).toBeLessThan(2);
 await expect(columns.nth(0).locator('h3')).toHaveCSS('max-width','none');
 await page.screenshot({path:'/private/tmp/cif-mantic-title-layout.png'});
});
