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
for (const width of [1440, 820, 390])
  test(`journey history restores reading and reflection at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await reflect(page);
    await continueReflection(page);
    await page.goBack();
    await expect(page.locator(".journey-reflection:visible")).toBeVisible();
    await page.goBack();
    await expect(page.locator(reader)).toBeVisible();
    await page.goForward();
    await expect(page.locator(".journey-reflection:visible")).toBeVisible();
    await noOverflow(page);
  });
