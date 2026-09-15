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
const prompts = JSON.parse(
  fs.readFileSync("src/data/record-reflections.json", "utf8"),
);
const editorial = JSON.parse(
  fs.readFileSync("src/data/record-editorial.json", "utf8"),
);
test("every featured passage has a question and distinct valid choices", () => {
  expect(Object.keys(prompts).sort()).toEqual(Object.keys(editorial).sort());
  for (const [key, p] of Object.entries<any>(prompts)) {
    expect(p.question.endsWith("?")).toBeTruthy();
    expect(p.options.length).toBe(2);
    expect(new Set(p.options.map((o) => o.target)).size).toBe(2);
    for (const option of p.options) {
      expect(editorial[option.target]).toBeTruthy();
      expect(option.target).not.toBe(key);
      expect(option.explanation.length).toBeGreaterThan(60);
    }
  }
});
for (const width of [390, 1440])
  test(`reflection choices and private notes survive reload at ${width}`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await readPerson(page);
    await reflect(page);
    await page.locator(".reflection-option:visible").first().click();
    await page
      .getByLabel("Your own thoughts (optional)", { exact: true })
      .fill("Private test thought");
    await continueReflection(page);
    const url = page.url();
    expect(url).not.toContain("Private");
    await page.reload();
    await page.goBack();
    await expect(
      page.getByLabel("Your own thoughts (optional)", { exact: true }),
    ).toHaveValue("Private test thought");
    await expect(
      page.locator(".reflection-option:visible").first(),
    ).toHaveAttribute("aria-pressed", "true");
    const fresh = await context.browser()!.newContext();
    const shared = await fresh.newPage();
    await shared.goto(url);
    expect(
      await shared
        .locator("textarea")
        .evaluateAll((ns) => ns.map((n) => (n as HTMLTextAreaElement).value)),
    ).not.toContain("Private test thought");
    await fresh.close();
  });
test("reflection can continue without an answer", async ({ page }) => {
  await readPerson(page);
  await reflect(page);
  await continueReflection(page);
  await expect(
    page.locator(".reflection-next:visible .onward-source"),
  ).not.toHaveCount(0);
});
