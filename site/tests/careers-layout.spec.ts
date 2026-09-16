import {test,expect} from '@playwright/test';
test('careers proposal copy sits directly below its heading',async({page})=>{
 for(const width of [1470,390]){
 await page.setViewportSize({width,height:900});await page.goto('/careers/');
 const section=page.locator('.careers-proposal');await section.scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const title=await section.locator('h3').boundingBox(),body=await section.locator('.body').boundingBox();
 expect(Math.abs(title!.x-body!.x)).toBeLessThan(1);expect(body!.y-title!.y-title!.height).toBeLessThan(30);
 await expect(section.locator('h3')).toHaveCSS('max-width','none');
 await section.screenshot({path:`/private/tmp/cif-careers-layout-${width}.png`});
 }
});
