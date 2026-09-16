import {test,expect} from '@playwright/test';
import {recordPath} from './record-helpers';
test('navigation stays compact while underline moves',async({page})=>{
 await page.goto(recordPath);
 const nav=page.locator('.topbar .atlas-nav');
 const buttons=nav.locator('button');
 const boxes=await buttons.evaluateAll(ns=>ns.map(n=>{const b=n.getBoundingClientRect();return {left:b.left,right:b.right};}));
 for(let i=1;i<boxes.length;i++) expect(boxes[i].left-boxes[i-1].right).toBeLessThan(30);
 const bar=nav.locator('.nav-slide-indicator');
 for(const label of ['Follow','Compare','About','Contribute','Explore']) {
  await nav.getByRole('button',{name:label,exact:true}).click();
  await expect.poll(async()=>{
   const b=await bar.boundingBox();const l=await nav.locator('.atlas-tab.active .atlas-tab-label').boundingBox();
   return b&&l?Math.abs(b.x-l.x)+Math.abs(b.width-l.width):999;
  }).toBeLessThan(2);
 }
 await page.screenshot({path:'/private/tmp/cif-nav-underline.png'});
});
