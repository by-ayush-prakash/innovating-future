import {test,expect} from '@playwright/test';
test('About image stays anchored during loading and navigation',async({page})=>{
 await page.goto('/work/coexisting-with-ai/record/explore/?view=about');
 const image=page.locator('.about-art');
 for(let i=0;i<8;i++){
  await expect(image).toBeVisible();
  const box=await image.boundingBox();expect(box!.y).toBe(78);
  await page.waitForTimeout(40);
 }
 await page.getByRole('button',{name:'Explore',exact:true}).click();
 await page.getByRole('button',{name:'About',exact:true}).click();
 for(let i=0;i<8;i++){
  const box=await image.boundingBox();expect(box!.y).toBe(78);
  await page.waitForTimeout(40);
 }
 await page.screenshot({path:'/private/tmp/cif-about-stable.png'});
});
