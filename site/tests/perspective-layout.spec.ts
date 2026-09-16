import {test,expect} from '@playwright/test';
import {openQuestion} from './record-helpers';
test('perspective list fits below the header and all rows remain reachable',async({page})=>{
 for(const size of [{width:1470,height:740},{width:390,height:844}]){
 await page.setViewportSize(size);await openQuestion(page,'work');
 const list=page.locator('.journey-screen-picker:visible > .onward-previews');
 const scroller=size.width>900 ? page.locator('.question-view:visible') : list;
 const box=await scroller.boundingBox();expect(box!.y+box!.height).toBeLessThanOrEqual(size.height);
 if(size.width>900) expect(box!.y).toBe(78);
 await scroller.evaluate(el=>el.scrollTop=el.scrollHeight);
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

test('perspective list has no separate clipping box while scrolling',async({page})=>{
 await page.setViewportSize({width:1470,height:740});await openQuestion(page,'judgment');
 const list=page.locator('.journey-screen-picker:visible > .onward-previews');
 await expect(list).toHaveCSS('overflow-y','visible');
 await list.hover();await page.mouse.wheel(0,180);await page.waitForTimeout(500);
 expect(await list.evaluate(el=>el.scrollTop)).toBe(0);
 expect(await page.locator('.question-view:visible').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
 await page.screenshot({path:'/private/tmp/cif-chooser-page-scroll.png'});
});

test('hover highlight remains visible up to the actual header edge',async({page})=>{
 await page.setViewportSize({width:1470,height:740});await openQuestion(page,'judgment');
 const view=page.locator('.question-view:visible');
 await view.evaluate(el=>el.scrollTop=180);
 await page.mouse.move(1100,120);await page.waitForTimeout(250);
 const headerBottom=await page.locator('.topbar').evaluate(el=>el.getBoundingClientRect().bottom);
 const atEdge=await page.evaluate(y=>!!document.elementFromPoint(1000,y+1)?.closest('.onward-preview'),headerBottom);


 expect(atEdge).toBe(true);
 await page.screenshot({path:'/private/tmp/cif-highlight-at-header-edge.png'});
});
