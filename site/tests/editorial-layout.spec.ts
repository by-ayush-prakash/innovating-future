import {test,expect} from '@playwright/test';
for(const width of [1470,820,390]) for(const route of ['/work/','/work/mantic/','/work/coexisting-with-ai/']) test(`${route} editorial rows at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(route);
 const rows=page.locator('.editorial-row');expect(await rows.count()).toBeGreaterThan(0);
 for(let i=0;i<await rows.count();i++){
  const row=rows.nth(i);await row.scrollIntoViewIfNeeded();await page.waitForTimeout(650);
  const photo=await row.locator('.afig').boundingBox(),copy=await row.locator(':scope > div:not(.afig)').boundingBox();
  expect(photo).toBeTruthy();expect(copy).toBeTruthy();
  await expect(row.locator('h3')).toHaveCSS('max-width','none');
  if(width>900) expect(copy!.width).toBeGreaterThan(photo!.width*1.5);
  else expect(photo!.y+photo!.height).toBeLessThanOrEqual(copy!.y+1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width!==820) await row.screenshot({path:`/private/tmp/cif-editorial-${route.split('/').filter(Boolean).join('-')}-${i}-${width}.png`});
 }
});
test('Work headline uses the hero width',async({page})=>{
 await page.setViewportSize({width:1470,height:900});await page.goto('/work/');await page.waitForTimeout(700);
 await expect(page.locator('.work-head h1')).toHaveCSS('max-width','none');
 await page.locator('.work-head').screenshot({path:'/private/tmp/cif-work-heading.png'});
});
