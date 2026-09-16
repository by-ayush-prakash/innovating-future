import {test,expect} from '@playwright/test';
test('landing and About share the same explanations',async({page})=>{
 await page.setViewportSize({width:1470,height:900});
 await page.goto('/work/coexisting-with-ai/record/');
 const landing=await page.locator('.record-how').innerText();
 await page.locator('.record-how').evaluate(n=>n.scrollIntoView({block:'center',behavior:'instant'}));
 await page.locator('.about-principle summary').first().click();
 await page.waitForTimeout(300);
 await page.screenshot({path:'/private/tmp/cif-shared-how-landing.png'});
 await page.goto('/work/coexisting-with-ai/record/explore/?view=about');
 expect(await page.locator('.record-how').innerText()).toBe(landing);
});
