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
  test(`editorial story and source stay readable at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await expect(page.locator(reader + " .reading-description")).toContainText(
      "Nick Nadeau",
    );
    await expect(
      page.locator(reader + " .reading-next-steps>button"),
    ).toHaveCount(3);
    await contextMode(page, "read");
    await expect(page.locator(reader + " .reading-turns")).not.toContainText(
      "Loading",
    );
    await expect(page.locator(reader + " .source-turn")).not.toHaveCount(0);
    await noOverflow(page);
  });
test("every editorial card has matching source and paragraph metadata", async ({
  page,
}) => {
  await openQuestion(page);
  const data = await page.locator("#record-journey-data").textContent();
  for (const story of JSON.parse(data!)) {
    expect(story.key).toContain(story.source.speaker);
    expect(story.source.turnsUrl).toMatch(/sources\/\d+\.json$/);
    expect(story.summary.length).toBeGreaterThan(20);
  }
});
