import {test,expect} from '@playwright/test';
test('Record landing retains its three images',async({page})=>{
 await page.setViewportSize({width:1470,height:900});
 await page.goto('/work/coexisting-with-ai/record/');
 const images=page.locator('.report-art img');
 await expect(images).toHaveCount(3);
 for(const img of await images.all()) { await expect(img).toBeVisible(); await expect.poll(()=>img.evaluate((n:HTMLImageElement)=>n.naturalWidth)).toBeGreaterThan(0); }
 const title=page.locator('#goal .intro h3');
 expect(await title.evaluate(n=>n.getBoundingClientRect().width/n.parentElement!.getBoundingClientRect().width)).toBeGreaterThan(.95);
 await title.evaluate(n=>n.scrollIntoView({block:"center",behavior:"instant"}));
 await page.waitForTimeout(350);
 await page.screenshot({path:'/private/tmp/cif-wide-goal-title.png'});
 await page.locator('.report-hero').scrollIntoViewIfNeeded();
 await page.waitForTimeout(1200);
 await page.screenshot({path:'/private/tmp/cif-restored-landing.png'});
});
