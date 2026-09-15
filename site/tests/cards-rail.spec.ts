import { test, expect } from "@playwright/test";
import {
  recordPath,
  picker,
  reader,
  openQuestion,
  readPerson,
  contextMode,
  reflect,
  continueReflection,
  noOverflow,
} from "./record-helpers";
for (const width of [1280, 390])
  test(`cards and arrows fit at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuestion(page, "creativity");
    const cards = page.locator(picker + " .onward-source");
    await expect(cards).toHaveCount(3);
    for (const c of await cards.all())
      await expect(c).toHaveAttribute("aria-label", /^Read .+ perspective$/);
    await noOverflow(page);
  });
