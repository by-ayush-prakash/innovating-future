import {test,expect} from '@playwright/test';
test('Follow the show has its section artwork',async({page})=>{
 await page.goto('/podcast/');
 const section=page.locator('.ctab--menu');
 await section.scrollIntoViewIfNeeded();
 await expect(section.locator(':scope > .rnw')).toBeVisible();
 await expect(section.locator('h2')).toHaveCSS('color','rgb(255, 255, 255)');
 await page.screenshot({path:'/private/tmp/cif-follow-background.png'});
});
