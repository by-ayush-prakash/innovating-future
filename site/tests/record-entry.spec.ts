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
for (const id of ["evidence", "learning", "understanding", "judgment"])
  test(`question click and refresh preserve one screen: ${id}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(recordPath);
    await page.locator(`.welcome-card[href*="question=${id}&"]`).click();
    await expect(page.locator(picker)).toBeVisible();
    await expect(page.locator(".explore-welcome")).toBeHidden();
    await page.reload();
    await expect(page.locator(picker)).toBeVisible();
    await expect(page.locator(".question-view:visible")).toHaveCount(1);
    await expect(page.locator(".record-entry-curtain")).toHaveCount(0);
  });
