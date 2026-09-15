import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`context chooser matches throughout journey at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/work/coexisting-with-ai/record/explore/?question=creativity');await page.getByRole('button',{name:'Let’s explore'}).click();await page.locator('[data-view="creativity"] .explore-position-row').filter({hasText:'Mike Todasco'}).click();await page.waitForTimeout(1100);
 const main=page.locator('.source-section .context-options');const trigger=page.locator('.source-section [data-context-toggle]');await trigger.click();await page.waitForTimeout(350);
 const styles=async(node:any)=>node.evaluate((element:HTMLElement)=>{const s=getComputedStyle(element);return [s.backgroundColor,s.borderRadius,s.boxShadow,s.padding,s.gap,s.fontSize,s.fontWeight,s.minHeight,s.borderWidth];});
 const reference={panel:await styles(main),trigger:await styles(trigger),listen:await styles(main.locator('button').first()),read:await styles(main.locator('button').last())};
 await page.locator('.source-section .journey-continuations .onward-source').first().click();await page.waitForTimeout(1100);
 const branch=page.locator('.journey-chapter .record-perspective:not([hidden])').first();const branchTrigger=branch.locator('[data-context-toggle]');await branchTrigger.click();await page.waitForTimeout(350);const panel=branch.locator('.context-options');
 expect(await styles(panel)).toEqual(reference.panel);expect(await styles(branchTrigger)).toEqual(reference.trigger);expect(await styles(panel.locator('button').first())).toEqual(reference.listen);expect(await styles(panel.locator('button').last())).toEqual(reference.read);
 await expect(panel.getByRole('button',{name:'Listen',exact:true})).toBeVisible();await expect(panel.getByRole('button',{name:'Read',exact:true})).toBeVisible();
 await page.waitForTimeout(350);await page.screenshot({path:`/tmp/cif-shared-context-${width}.png`});
 await branchTrigger.press('Escape');await expect(panel).toBeHidden();await expect(branchTrigger).toBeFocused();
});
