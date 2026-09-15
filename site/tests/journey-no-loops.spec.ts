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
  test(`all questions remain reachable and unique at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(recordPath);
    await expect(page.locator(".welcome-card")).toHaveCount(10);
    const ids = await page
      .locator(".welcome-card")
      .evaluateAll((ns) =>
        ns.map((n) =>
          new URL((n as HTMLAnchorElement).href).searchParams.get("question"),
        ),
      );
    expect(new Set(ids).size).toBe(10);
    for (const id of ids) {
      await openQuestion(page, id!);
      await expect(page.locator(picker + " .onward-source")).toHaveCount(3);
      await noOverflow(page);
    }
  });
