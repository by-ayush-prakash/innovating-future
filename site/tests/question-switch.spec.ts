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
  test(`Explore returns to a usable question after Follow at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuestion(page, "creativity");
    await page.getByRole("button", { name: "Follow", exact: true }).click();
    await expect(page.locator("[data-people-view]")).toBeVisible();
    await page.getByRole("button", { name: "Explore", exact: true }).click();
    await expect(page.locator(picker)).toBeVisible();
    await expect(page.locator(".question-view:visible")).toHaveCount(1);
    await noOverflow(page);
  });
