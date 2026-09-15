import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`cards and current section at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/work/coexisting-with-ai/record/explore/?question=creativity');await page.getByRole('button',{name:'Let’s explore'}).click();await page.waitForTimeout(1100);
 await page.screenshot({path:`/tmp/cif-cards-${width}.png`});
 if(width===1280){const rows=await page.locator('[data-view="creativity"] .perspective-speaker').evaluateAll(nodes=>nodes.map(n=>Math.round(n.getBoundingClientRect().top)));expect(new Set(rows).size).toBe(1);}
 await page.locator('[data-view="creativity"] .explore-position-row').filter({hasText:'Mike Todasco'}).click();await page.waitForTimeout(1100);
 const rail=page.locator('[data-view="creativity"] .explore-section-rail');
 for(const label of ['keep exploring','reading','perspectives']){
  await rail.getByRole('button',{name:`Go to ${label}`,exact:true}).click();await page.waitForTimeout(1100);await expect(rail.getByRole('button',{name:`Go to ${label}`,exact:true})).toHaveAttribute('aria-current','location');
 }
 await page.locator('.source-section .journey-continuations .onward-source').first().click();await page.waitForTimeout(1100);await expect(rail.getByRole('button',{name:'Go to reading',exact:true})).toHaveAttribute('aria-current','location');
});
