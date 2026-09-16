import {test,expect} from '@playwright/test';
test('path headings remain inside their cards',async({page})=>{
 for(const size of [{width:1470,height:740},{width:1280,height:900},{width:390,height:844}]){
 await page.setViewportSize(size);await page.goto('/work/coexisting-with-ai/record/explore/');
 await page.waitForTimeout(900);
 const cards=await page.locator('.welcome-card').evaluateAll(els=>els.slice(0,4).map(el=>{const c=el.getBoundingClientRect(),h=el.querySelector('h2')!.getBoundingClientRect();return {inside:h.top>=c.top && h.bottom<=c.bottom,width:c.width,top:c.top,bottom:c.bottom}}));
 expect(cards.every(c=>c.inside)).toBe(true);
 expect(cards[0].width).toBeGreaterThan(300);
 expect(cards[0].top).toBeLessThan(size.width>760?110:135);
 if(size.width>760) expect(cards[3].bottom).toBeLessThanOrEqual(size.height);
 await expect(page.locator('.path-number')).toHaveCount(0);
 if(size.width===1470){
 const card=page.locator('.welcome-card').first();await card.hover();
 await expect(card.locator('h2')).toHaveCSS('font-weight','500');
 await page.screenshot({path:'/private/tmp/cif-card-selected.png'});
 await page.mouse.move(0,0);
 const artwork=await page.locator('.question-concept-art--additional').evaluateAll(els=>els.map(el=>el.innerHTML));
 expect(new Set(artwork).size).toBe(artwork.length);
 await page.locator('.welcome-card-grid').evaluate(el=>el.scrollTop=el.clientHeight);
 await page.screenshot({path:'/private/tmp/cif-additional-paths.png'});
 for(const index of [4,6,8]){
 await page.locator('.welcome-card-grid').evaluate((el,index)=>{const card=el.children[index] as HTMLElement;el.scrollTop=card.offsetTop;},index);
 await page.screenshot({path:`/private/tmp/cif-path-row-${index}.png`});
 }
 await page.locator('.welcome-card-grid').evaluate(el=>el.scrollTop=0);
 }
 await page.screenshot({path:`/private/tmp/cif-path-${size.width}.png`});
 }
});
