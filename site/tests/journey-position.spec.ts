import {test,expect} from '@playwright/test';
import {readPerson} from './record-helpers';
test('My Journey remains at the bottom left',async({page})=>{
 await page.setViewportSize({width:1470,height:900});
 await readPerson(page);
 await page.waitForTimeout(350);
 const pill=page.locator('.journey-screen-steps:visible');
 const box=await pill.boundingBox();
 expect(box!.y+box!.height).toBeGreaterThan(850);
 expect(box!.x).toBeLessThan(65);
 await pill.locator('summary').click();
 await page.waitForTimeout(300);
 await page.screenshot({path:'/private/tmp/cif-journey-position.png'});
});
