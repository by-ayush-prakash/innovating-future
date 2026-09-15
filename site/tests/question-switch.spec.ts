import {test,expect} from '@playwright/test';
for(const width of [1280,390]) test(`question changes stay with the cards at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/work/coexisting-with-ai/record/explore/?question=work');
 await page.getByRole('button',{name:'Let’s explore'}).click();
 for(const question of ['creativity','learning','work']) {
  await page.locator('.question-view:not([hidden]) [data-change-question]').click();
  await page.locator(`[data-question-panel] [data-question="${question}"]`).click();
  const view=page.locator(`.question-view[data-view="${question}"]`);
  await expect(view).toBeVisible();
  await expect(view).toHaveClass(/views-revealed/);
  await expect(view.locator('.question-conversation-art')).toBeHidden();
  await expect(view.locator('[data-explore-start]')).toBeHidden();
  await expect(view.locator('.explore-position-row')).toHaveCount(3);
  await expect(view.locator('.explore-position-row').first()).toBeVisible();
  await expect(page.locator('[data-question-panel]')).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`question=${question}`));
 }
 await page.screenshot({path:`/tmp/cif-question-switch-${width}.png`});
});
test('changing a question before starting preserves the opening',async({page})=>{
 await page.goto('/work/coexisting-with-ai/record/explore/?question=work');
 await page.locator('.question-view:not([hidden]) [data-change-question]').click();
 await page.locator('[data-question-panel] [data-question="creativity"]').click();
 await expect(page.getByRole('button',{name:'Let’s explore'})).toBeVisible();
});
