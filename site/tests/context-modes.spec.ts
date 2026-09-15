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
  test(`context modes replace each other at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await contextMode(page, "read");
    await contextMode(page, "listen");
    await expect(page.locator(reader + " .reading-context-slot")).toBeHidden();
    await expect(page.locator(reader + " audio")).toHaveCount(1);
    await contextMode(page, "read");
    await expect(page.locator(reader + " .reading-recording")).toBeHidden();
    await expect(page.locator(reader + " audio")).toHaveCount(0);
    await page.getByLabel("Close conversation", { exact: true }).click();
    await expect(page.locator(reader + " .reading-context-slot")).toBeHidden();
  });
