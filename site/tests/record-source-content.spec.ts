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
import fs from "node:fs";
const excerpts = JSON.parse(
  fs.readFileSync("src/data/record-source-excerpts.generated.json", "utf8"),
);
const editorial = JSON.parse(
  fs.readFileSync("src/data/record-editorial-sources.generated.json", "utf8"),
);
test("every lazy source record preserves supplied transcript words", async ({
  page,
  request,
}) => {
  await openQuestion(page);
  const stories = JSON.parse(
    (await page.locator("#record-journey-data").textContent())!,
  );
  for (const story of stories) {
    const expected =
      editorial[story.editorialKey] ||
      excerpts[`${story.source.speaker}|${story.source.timestamp}`];
    expect(expected, story.key).toBeTruthy();
    const response = await request.get(story.source.turnsUrl);
    expect(response.status()).toBe(200);
    const actual = await response.json();
    expect(actual, story.key).toEqual(expected.turns);
  }
});
for (const width of [1280, 390])
  test(`Pamela source is readable at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page, "Pamela Gay", "work");
    await contextMode(page, "read");
    await expect(page.locator(reader + " .reading-turns")).not.toContainText(
      "Loading",
    );
    await expect(page.locator(reader + " .source-turn")).not.toHaveCount(0);
    await noOverflow(page);
  });
