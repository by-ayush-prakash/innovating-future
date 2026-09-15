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
  test(`context chooser stays consistent after changing people at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await page.locator(reader + " [data-context-toggle]").click();
    const styles = async () =>
      page.locator(reader + " .context-options").evaluate((n) => {
        const s = getComputedStyle(n);
        return [s.padding, s.gap, s.borderRadius, s.fontSize];
      });
    const first = await styles();
    await page
      .getByRole("button", { name: "See another perspective →", exact: true })
      .click();
    await page
      .locator(picker + " .onward-source")
      .first()
      .click();
    await page.locator(reader + " [data-context-toggle]").click();
    expect(await styles()).toEqual(first);
    await noOverflow(page);
  });
