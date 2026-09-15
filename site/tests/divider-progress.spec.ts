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
  test(`reading actions retain their divider after Back at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    const style = async () =>
      page
        .locator(reader + " .reading-next-steps")
        .evaluate((n) => getComputedStyle(n).backgroundImage);
    const original = await style();
    expect(original).toContain("linear-gradient");
    await reflect(page);
    await page.goBack();
    await expect(page.locator(reader)).toBeVisible();
    expect(await style()).toBe(original);
  });
