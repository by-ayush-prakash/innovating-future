import {test,expect} from '@playwright/test';
test('card chooser and compact header render before the app script loads',async({page})=>{
 await page.route('**/*.js',route=>route.abort());
 await page.goto('/work/coexisting-with-ai/record/explore/');
 await expect(page.locator('.explore-welcome')).toBeVisible();
 const nav=page.locator('.atlas-tab');
 const first=await nav.first().boundingBox();const last=await nav.last().boundingBox();
 expect(last!.x-first!.x).toBeLessThan(500);
 await page.reload();
 await expect(page.locator('.welcome-card--evidence')).toBeVisible();
 await page.screenshot({path:'/private/tmp/cif-reload-before-scripts.png'});
});
