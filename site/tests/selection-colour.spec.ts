import {test,expect} from '@playwright/test';
test('site and Record selectors share the episode colour wash',async({page})=>{
 await page.goto('/podcast/');
 await page.locator('.ntrig').first().hover();
 await page.waitForTimeout(250);
 const trigger=page.locator('.ntrig').first();
 await expect(trigger).toHaveCSS('background-image','none');
 const highlight=await trigger.evaluate(el=>{const s=getComputedStyle(el,'::before');return {height:s.height,radius:s.borderRadius,opacity:s.opacity};});
 expect(highlight).toEqual({height:'44px',radius:'12px',opacity:'1'});
 await page.locator('nav.site').screenshot({path:'/private/tmp/cif-navigation-highlight.png'});
 const link=page.locator('.npanel a:visible').first();await link.hover();
 const gradient=await link.evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(gradient).toContain('linear-gradient');
 await page.goto('/');
 const row=page.locator('.prow').first();await row.hover();
 await expect(row).toHaveCSS('background-image',gradient);
 await expect(row).toHaveCSS('background-color','rgb(255, 255, 255)');
 await page.waitForTimeout(700);
 await page.screenshot({path:'/private/tmp/cif-menu-row-selection.png'});
 await page.goto('/contact/');
 await expect(page.locator('.cinfo')).toHaveCSS('background-image',gradient);
 await expect(page.locator('.cinfo')).toHaveCSS('background-color','rgb(255, 255, 255)');
 await page.locator('.cinfo').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 await page.screenshot({path:'/private/tmp/cif-contact-surface.png'});
 await page.goto('/work/coexisting-with-ai/record/explore/');
 const card=page.locator('.welcome-card').first();await card.hover();
 await expect(card).toHaveCSS('background-image',gradient);
 await page.screenshot({path:'/private/tmp/cif-shared-selection.png'});
});
test('coverage selectors have inset content and the shared wash',async({page})=>{
 for(const width of [1470,390]){
 await page.setViewportSize({width,height:900});await page.goto('/media/');
 const row=page.locator('.rrow').filter({hasText:'Psychology Today'});await row.scrollIntoViewIfNeeded();await row.hover();await page.waitForTimeout(650);
 await expect(row).toHaveCSS('border-radius','16px');
 const geometry=await row.evaluate(el=>{const r=el.getBoundingClientRect(),first=el.firstElementChild!.getBoundingClientRect(),last=el.lastElementChild!.getBoundingClientRect();return {left:first.left-r.left,right:r.right-last.right,background:getComputedStyle(el).backgroundImage};});
 expect(geometry.left).toBeGreaterThanOrEqual(18);expect(geometry.right).toBeGreaterThanOrEqual(18);expect(geometry.background).toContain('linear-gradient');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await row.screenshot({path:`/private/tmp/cif-media-selector-${width}.png`});
 }
});
