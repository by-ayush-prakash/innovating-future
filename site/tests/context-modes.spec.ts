import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`context switches exclusively without moving controls at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/work/coexisting-with-ai/record/explore/?question=creativity');
 await page.getByRole('button',{name:'Let’s explore'}).click();
 await page.locator('[data-view="creativity"] .explore-position-row').filter({hasText:'Mike Todasco'}).click();
 await page.waitForTimeout(1200);
 const toggle=page.locator('[data-context-toggle]');
 await toggle.scrollIntoViewIfNeeded();
 for(const mode of ['read','listen','read','listen']){
  await toggle.click();
  const before=await page.evaluate(()=>scrollY);
  await page.locator(mode==='read'?'[data-context-read]':'[data-inspector-video]').click();
  await expect(toggle).toBeVisible();
  if(mode==='read'){await expect(page.locator('[data-context-reading]')).toBeVisible();await expect(page.locator('[data-inspector-media]')).toBeHidden();}
  else {await expect(page.locator('[data-context-reading]')).toBeHidden();await expect(page.locator('[data-inspector-media]')).toBeVisible();}
  const samples=[];for(let i=0;i<8;i++){await page.waitForTimeout(100);samples.push(await page.evaluate(()=>scrollY));}
  expect(Math.max(...samples)-Math.min(...samples)).toBeLessThanOrEqual(1);
  expect(Math.abs(samples[7]-before)).toBeLessThanOrEqual(1);
 }
 await toggle.click();await page.locator('[data-context-read]').click();
 await page.locator('.source-conversation').scrollIntoViewIfNeeded();
 await page.screenshot({path:`/tmp/cif-context-${width}.png`});
});
test('continued journey context also replaces modes',async({page})=>{
 await page.goto('/work/coexisting-with-ai/record/explore/?question=creativity');
 await page.getByRole('button',{name:'Let’s explore'}).click();
 await page.locator('[data-view="creativity"] .explore-position-row').filter({hasText:'Mike Todasco'}).click();
 await page.locator('.source-section .journey-continuations .onward-source').first().click();
 const branch=page.locator('.journey-chapter .record-perspective:not([hidden])').first();
 for(const mode of ['Read','Listen','Read']){
  await branch.locator('.branch-context>summary').click();
  await branch.locator('.branch-context-options').getByRole('button',{name:mode,exact:true}).click();
  await expect(branch.locator('.branch-context>summary')).toBeVisible();
  if(mode==='Read'){await expect(branch.locator('.branch-transcript')).toBeVisible();await expect(branch.locator('.branch-recording')).toBeHidden();await expect(branch.locator('.branch-recording iframe')).toHaveCount(0);}
  else{await expect(branch.locator('.branch-transcript')).toBeHidden();await expect(branch.locator('.branch-recording')).toBeVisible();}
 }
});
