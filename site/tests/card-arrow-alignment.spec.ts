import {test,expect} from '@playwright/test';
test('every arrow is centred in its circle',async({page})=>{
 for(const width of [1470,390]){
 await page.setViewportSize({width,height:900});await page.goto('/work/coexisting-with-ai/record/explore/');
 const offsets=await page.locator('.welcome-card-action').evaluateAll(els=>els.map(el=>{const c=el.getBoundingClientRect(),a=el.querySelector('svg')!.getBoundingClientRect();return {x:Math.abs(c.x+c.width/2-a.x-a.width/2),y:Math.abs(c.y+c.height/2-a.y-a.height/2)}}));
 expect(offsets.length).toBeGreaterThan(4);
 for(const o of offsets){expect(o.x).toBeLessThan(1);expect(o.y).toBeLessThan(1);}
 if(width===1470){await page.locator('.welcome-card--learning').hover();await expect(page.locator('.welcome-card--learning')).toHaveCSS('background-color','rgb(196, 165, 223)');await page.screenshot({path:'/private/tmp/cif-arrows-centred.png'});}
 }
});
