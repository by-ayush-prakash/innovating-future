import {test,expect} from '@playwright/test';
import {openQuestion} from './record-helpers';
test('perspective list fits below the header and all rows remain reachable',async({page})=>{
 for(const size of [{width:1470,height:740},{width:390,height:844}]){
 await page.setViewportSize(size);await openQuestion(page,'work');
 const list=page.locator('.journey-screen-picker:visible > .onward-previews');
 const box=await list.boundingBox();expect(box!.y+box!.height).toBeLessThanOrEqual(size.height-20);
 if(size.width>900) expect(box!.y).toBeLessThan(115);
 await list.evaluate(el=>el.scrollTop=el.scrollHeight);
 const last=list.locator('.onward-preview').last();
 const lastBox=await last.boundingBox();expect(lastBox!.y+lastBox!.height).toBeLessThanOrEqual(box!.y+box!.height);
 await last.getByRole('button').click();
 await expect(page.locator('.record-perspective:visible')).toBeVisible();
 }
});
test('inspect tightened perspective layout',async({page})=>{
 await page.setViewportSize({width:1470,height:740});await openQuestion(page,'work');
 await page.screenshot({path:'/private/tmp/cif-picker-spacing.png'});
});

test('question and subtitle are centered above the journey control',async({page})=>{
 await page.setViewportSize({width:1470,height:740});await openQuestion(page,'work');
 const intro=page.locator('.journey-screen-picker:visible > .perspective-intro');
 const heading=await intro.locator('h2').boundingBox();const subtitle=await intro.locator('p').boundingBox();
 const blockCenter=(heading!.y+subtitle!.y+subtitle!.height)/2;
 const area=await intro.boundingBox();
 expect(Math.abs(blockCenter-(area!.y+(area!.height-72)/2))).toBeLessThan(2);
 expect(Math.abs((heading!.x+heading!.width/2)-(area!.x+area!.width/2))).toBeLessThan(2);
 await page.screenshot({path:'/private/tmp/cif-picker-centered.png'});
});
test('desktop list settles with a complete headline below the header',async({page})=>{
 await page.setViewportSize({width:1470,height:740});await openQuestion(page,'work');
 const list=page.locator('.journey-screen-picker:visible > .onward-previews');
 await list.evaluate(el=>el.scrollTop=70);await page.waitForTimeout(700);
 const heading=await list.locator('.onward-card-heading').first().boundingBox(),box=await list.boundingBox(),header=await page.locator('.topbar').boundingBox();
 expect(heading!.y).toBeGreaterThanOrEqual(box!.y);expect(box!.y).toBeGreaterThan(header!.y+header!.height);
 await page.screenshot({path:'/private/tmp/cif-picker-scroll-settled.png'});
});
