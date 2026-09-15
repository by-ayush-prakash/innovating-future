import {test,expect} from '@playwright/test';
for(const width of [1440,390])test(`source story is readable and continued at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/work/coexisting-with-ai/record/explore/?question=understanding');await page.getByRole('button',{name:'Let’s explore'}).click();
 await page.locator('[data-view="understanding"] .explore-position-row').first().click();await page.waitForTimeout(250);
 const source=page.locator('.source-section');
 await expect(source.locator('[data-inspector-claim]').first()).toHaveText('A shortcut home tells us something words cannot');
 await expect(source.locator('[data-journey-summary]')).toContainText('A mouse wanders');
 await expect(source.locator('[data-journey-standfirst]')).toContainText('new route');
 const geometry=await source.evaluate(el=>{const panel=el.querySelector('.reading-panel')!.getBoundingClientRect();const next=el.querySelector('.journey-connection')!.getBoundingClientRect();return {panel:panel.height,next:next.top,overflow:document.documentElement.scrollWidth>innerWidth};});
 expect(geometry.overflow).toBe(false);expect(geometry.next).toBeGreaterThanOrEqual(900);
 await page.screenshot({path:`/tmp/cif-editorial-source-${width}.png`});
 await source.locator('[data-context-toggle]').click();await source.locator('[data-context-read]').click();
 await expect(source.locator('[data-inspector-transcript]')).toContainText('windy path');
 await source.locator('.journey-continuations .onward-source').first().click();await page.waitForTimeout(250);
 const branch=page.locator('.journey-branch-source:not([hidden])').last();
 expect((await branch.locator('.reading-description').textContent())!.split(/\s+/).length).toBeGreaterThan(75);
 await expect(branch.locator('.source-standfirst')).toBeVisible();await page.screenshot({path:`/tmp/cif-editorial-branch-${width}.png`});
});
test('all featured cards lead to an editorial paragraph and matching source metadata',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const id of ['understanding','evidence','learning','creativity','work','judgment','relationships','wellbeing','privacy','governance']){
  await page.goto(`/work/coexisting-with-ai/record/explore/?question=${id}`);await page.getByRole('button',{name:'Let’s explore'}).click();
  const cards=page.locator(`[data-view="${id}"] .explore-position-row`);await expect(cards).toHaveCount(3);
  for(let i=0;i<3;i++){
   await cards.nth(i).click();const summary=page.locator('.source-section .record-perspective:not([hidden]) [data-journey-summary]');
   expect((await summary.textContent())!.split(/\s+/).length).toBeGreaterThan(75);
   await expect(page.locator('.source-section .record-perspective:not([hidden]) [data-journey-standfirst]')).not.toBeEmpty();
  }
 }
});
