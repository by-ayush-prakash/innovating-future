import { test, expect } from "@playwright/test";
import fs from "node:fs";
const editorial = JSON.parse(
  fs.readFileSync("src/data/record-editorial.json", "utf8"),
);
const connections = JSON.parse(
  fs.readFileSync("src/data/record-connections.json", "utf8"),
);
const sources = JSON.parse(
  fs.readFileSync("src/data/record-editorial-sources.generated.json", "utf8"),
);
test("every featured idea has a specific valid editorial connection and supplied source", () => {
  for (const [key, story] of Object.entries(editorial)) {
    expect(story.paragraph.split(/\s+/).length).toBeGreaterThan(75);
    expect(sources[key].turns.length).toBeGreaterThan(0);
    expect(connections[key].length).toBeGreaterThan(0);
    const seen = new Set();
    for (const link of connections[key]) {
      expect(editorial[link.key]).toBeTruthy();
      expect(link.key.split(":")[0]).not.toBe(key.split(":")[0]);
      expect(link.explanation.length).toBeGreaterThan(80);
      expect(seen.has(link.key)).toBeFalsy();
      seen.add(link.key);
    }
  }
});

import { readPerson, reflect, continueReflection } from "./record-helpers";
test("connected ideas open another question and Back restores the suggestions", async ({
  page,
}) => {
  await readPerson(page);
  await reflect(page);
  await continueReflection(page);
  const next = page.locator(".reflection-next:visible .onward-source").first();
  await next.click();
  await expect(page.locator(".record-perspective:visible")).toHaveCount(1);
  await page.goBack();
  await expect(page.locator(".reflection-next:visible")).toBeVisible();
});
