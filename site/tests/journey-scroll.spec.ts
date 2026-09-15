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
test("long context scrolls without losing the close action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await readPerson(page, "Pamela Gay", "work");
  await contextMode(page, "read");
  const turns = page.locator(reader + " .reading-turns");
  await expect(turns).not.toContainText("Loading");
  await turns.evaluate((n) => (n.scrollTop = n.scrollHeight));
  await expect(
    page.getByLabel("Close conversation", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Close conversation", { exact: true }).click();
  await expect(page.locator(reader + " .reading-context-slot")).toBeHidden();
});
