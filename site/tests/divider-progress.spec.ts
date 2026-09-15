import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`divider progress follows scroll and reverses at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/work/coexisting-with-ai/record/explore/?question=creativity');await page.getByRole('button',{name:'Let’s explore'}).click();await page.locator('[data-view="creativity"] .explore-position-row').nth(1).click();await page.waitForTimeout(1100);
 const section=page.locator('.source-section .journey-connection');const move=async(fraction:number)=>{await section.evaluate((node,f)=>{const r=node.getBoundingClientRect();window.scrollTo({top:scrollY+r.top+r.height*f-innerHeight*.55,behavior:'instant'});},fraction);await page.waitForTimeout(80);};
 const travel=()=>section.evaluate(n=>parseFloat((n as HTMLElement).style.getPropertyValue('--divider-travel')));
 await move(.2);const start=await travel();await move(.7);expect(await travel()).toBeGreaterThan(start);await move(.2);expect(await travel()).toBeCloseTo(start,0);
 const y=await page.evaluate(()=>scrollY),x=await travel();await page.waitForTimeout(400);expect(await page.evaluate(()=>scrollY)).toBe(y);expect(await travel()).toBe(x);
 await page.emulateMedia({reducedMotion:'reduce'});await move(.7);expect(await travel()).toBe(0);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>{(window as any).arrivalEvents=[];document.addEventListener('animationstart',e=>{if(e.animationName.startsWith('journey-'))(window as any).arrivalEvents.push(e.animationName);});});
 await page.locator('.source-section .journey-continuations .onward-source').first().click();await page.waitForTimeout(1100);const chapter=page.locator('.journey-chapter');await expect(chapter).toBeVisible();expect(await chapter.evaluate(n=>getComputedStyle(n,'::before').animationName)).toBe('none');
 expect(await page.evaluate(()=>(window as any).arrivalEvents)).toEqual(expect.arrayContaining(['journey-divider-arrive','journey-content-arrive']));
 await page.evaluate(()=>(window as any).arrivalEvents=[]);await page.locator('.source-section .journey-continuations .onward-source').first().click();await page.waitForTimeout(1100);expect(await page.evaluate(()=>(window as any).arrivalEvents)).toEqual([]);
 await page.screenshot({path:`/tmp/cif-divider-progress-${width}.png`});
});
