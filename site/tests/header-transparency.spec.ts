import {test,expect} from '@playwright/test';
test('public and Record headers share the frosted surface',async({page})=>{
 await page.goto('/contact/');
 await expect(page.locator('nav.site')).toHaveCSS('background-color','rgba(255, 255, 255, 0.78)');
 await expect(page.locator('nav.site')).toHaveCSS('backdrop-filter','blur(14px)');
 await page.goto('/work/coexisting-with-ai/record/explore/');
 await expect(page.locator('.topbar')).toHaveCSS('background-color','rgba(255, 255, 255, 0.78)');
 await expect(page.locator('.topbar')).toHaveCSS('backdrop-filter','blur(14px)');
});
