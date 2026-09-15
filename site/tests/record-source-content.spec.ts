import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const excerpts=JSON.parse(fs.readFileSync('src/data/record-source-excerpts.generated.json','utf8'));
const editorial=JSON.parse(fs.readFileSync('src/data/record-editorial-sources.generated.json','utf8'));
test('every source record preserves supplied transcript words', async ({page})=>{
 await page.goto('/work/coexisting-with-ai/record/explore/?question=understanding');
 const failures=await page.evaluate(({excerpts,editorial})=>{
  const errors:string[]=[];const normal=(s:string)=>s.replace(/\s+/g,' ').trim();
  const data=JSON.parse(document.querySelector('#record-journey-data')!.textContent!);
  for(const card of document.querySelectorAll<HTMLButtonElement>('[data-evidence]')){
   const story=data.find(s=>s.key===card.dataset.evidenceKey);const expected=editorial[story.editorialKey]||excerpts[`${card.dataset.speaker}|${card.dataset.timestamp}`];
   if(!expected||card.dataset.transcript!==expected.transcript){errors.push(`${card.dataset.evidenceKey}: source mismatch`);continue;}
   card.click();const panel=document.querySelector(`.record-perspective[data-journey-key="${CSS.escape(story.key)}"]`);
   const turns=Array.from(panel?.querySelectorAll('.reading-turns .source-turn')||[]);
   if(turns.length!==expected.turns.length||turns.some((turn,i)=>normal(Array.from(turn.querySelectorAll('p')).map(p=>p.textContent).join(' '))!==normal(expected.turns[i].text)))errors.push(`${story.key}: altered transcript`);
  }return errors;
 },{excerpts,editorial});expect(failures).toEqual([]);
});

for (const width of [1280, 390]) test(`Pamela source is readable and scrollable at ${width}px`, async ({ page }) => {
  await page.setViewportSize({width,height:900});
  await page.goto('/work/coexisting-with-ai/record/explore/?question=work');
  await page.getByRole('button',{name:'Let’s explore'}).click();
  await page.locator('[data-view="work"] .explore-position-row').filter({hasText:'Pamela Gay'}).click();
  await expect(page.locator('[data-inspector-transcript]')).toContainText('it is an algorithm talking to an algorithm');
  await expect(page.locator('.source-interpretation')).toHaveCount(0);
  await expect(page.locator('[data-inspector-transcript]')).not.toContainText('isn’t available');
  await expect(page.locator('[data-inspector-transcript] .source-turn').last()).toContainText('our own capabilities');
  await expect(page.locator('[data-inspector-transcript]')).toBeHidden();
  await page.locator('[data-context-toggle]').click();
 await page.locator('[data-context-read]').click();
  await expect(page.locator('[data-inspector-transcript]')).toBeVisible();
  for (const summary of await page.locator('[data-inspector-transcript] .source-more summary').all()) await summary.click();
  await page.locator('[data-inspector-transcript] .source-turn p').last().scrollIntoViewIfNeeded();
  await expect(page.locator('[data-inspector-transcript] .source-turn p').last()).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
});
