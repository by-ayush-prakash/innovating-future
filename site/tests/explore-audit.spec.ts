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
for (const width of [390, 768, 1024, 1440])
  test(`reader and reflection fit ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await noOverflow(page);
    await expect(page.locator(reader + " .reading-description")).toBeVisible();
    await reflect(page);
    await noOverflow(page);
    await page
      .getByLabel("Your own thoughts (optional)", { exact: true })
      .fill("An audit note");
    await continueReflection(page);
    await noOverflow(page);
  });
test("chooser supports keyboard focus and one main landmark", async ({
  page,
}) => {
  await readPerson(page);
  await expect(page.getByRole("main")).toHaveCount(1);
  const trigger = page.locator(reader + " [data-context-toggle]");
  await trigger.focus();
  await expect(page.locator(reader + " .context-options")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(reader + " .context-options")).toBeHidden();
  await expect(trigger).toBeFocused();
});
