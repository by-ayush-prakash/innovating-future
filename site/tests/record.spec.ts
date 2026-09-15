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
import AxeBuilder from "@axe-core/playwright";
test("primary routes resolve and the sitemap contains only canonical Record routes", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/work/",
    "/work/coexisting-with-ai/",
    "/work/coexisting-with-ai/record/",
    recordPath,
    "/contact/",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/work/coexisting-with-ai/record/explore");
  expect(sitemap).not.toContain("/work/coexisting-with-ai/atlas");
  expect(sitemap).not.toContain("/work/ai-native-generation");

  await page.goto(recordPath);
  const startViews = page.locator("[data-reveal-views]:visible");
  if (await startViews.count()) await startViews.click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/work\/coexisting-with-ai\/record\/explore$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator(".topbar .record-wordmark")).toHaveCount(0);
});

test("public forms have spam traps and preserve submissions for review", async ({
  page,
}) => {
  await page.goto("/work/coexisting-with-ai/record/");
  const landingUpdates = page.locator(
    'form[name="coexistence-record-updates"]',
  );
  await expect(landingUpdates).toHaveAttribute(
    "data-netlify-honeypot",
    "bot-field",
  );
  await landingUpdates.getByLabel("Email address").fill("reader@example.com");
  await landingUpdates.getByRole("button", { name: "Notify me" }).click();
  await expect(
    landingUpdates.locator("[data-report-signup-status]"),
  ).toHaveText("Subscription will activate on the published site.");

  await page.goto(`${recordPath}?view=contribute&question=privacy`);
  const startViews = page.locator("[data-reveal-views]:visible");
  if (await startViews.count()) await startViews.click();
  const suggestion = page.locator(
    'form[name="coexistence-record-suggestions"]',
  );
  const updates = page.locator(
    'form[name="coexistence-record-question-updates"]',
  );
  await expect(suggestion).toHaveAttribute(
    "data-netlify-honeypot",
    "bot-field",
  );
  await expect(suggestion.locator('input[name="bot-field"]')).toHaveCount(1);
  await expect(updates.locator('input[name="bot-field"]')).toHaveCount(1);

  await suggestion
    .locator(".contribution-types label", { hasText: "Source" })
    .click();
  await expect(suggestion.getByLabel("Source")).toBeChecked();
  await suggestion.getByLabel("Your suggestion").fill("A source to review");
  await suggestion.getByRole("button", { name: /Send suggestion/ }).click();
  await expect(suggestion.locator("[data-contribution-status]")).toHaveText(
    "This will submit on the published site.",
  );

  await page
    .getByRole("button", { name: /Follow this question/ })
    .first()
    .click();
  await updates.getByLabel("Email address").fill("reader@example.com");
  await updates.getByRole("button", { name: /Follow this question/ }).click();
  await expect(updates.locator("[data-contribution-status]")).toHaveText(
    "This will submit on the published site.",
  );
});

test("Record entry and application have no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/work/coexisting-with-ai/record/",
    `${recordPath}?view=explore&question=understanding`,
  ]) {
    await page.goto(path);
    const startViews = page.locator("[data-reveal-views]:visible");
    if (await startViews.count()) await startViews.click();
    await page.addStyleTag({
      content:
        "*,*::before,*::after{animation:none!important;transition:none!important}",
    });
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );
    expect(
      blocking,
      blocking.map((item) => `${item.id}: ${item.help}`).join("\n"),
    ).toEqual([]);
  }
});

test("refresh restores the selected question before application scripts load", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    route.request().resourceType() === "script"
      ? route.abort()
      : route.continue(),
  );
  await page.goto(`${recordPath}?view=explore&question=evidence`);
  await expect(page.locator(".question-view:visible")).toHaveAttribute(
    "data-view",
    "evidence",
  );
  await expect(page.locator("[data-question].active")).toHaveAttribute(
    "data-question",
    "evidence",
  );
  await page.reload();
  await expect(page.locator(".question-view:visible")).toHaveAttribute(
    "data-view",
    "evidence",
  );
});

test("Follow, profile, Compare and About preserve browser history", async ({
  page,
}) => {
  await openQuestion(page);
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page.locator('[data-open-person="nick-nadeau"]').click();
  await expect(page.locator('[data-person-view="nick-nadeau"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator("[data-people-view]")).toBeVisible();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.locator("[data-comparison-view]")).toBeVisible();
  await page.getByRole("button", { name: "About", exact: true }).click();
  await expect(page.locator("[data-about-view]")).toBeVisible();
  await page.goBack();
  await expect(page.locator("[data-comparison-view]")).toBeVisible();
});
test("logo returns directly to the main site", async ({ page }) => {
  await readPerson(page);
  await page
    .getByRole("link", {
      name: "Center for Innovating the Future, home",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("[data-prototype]")).toHaveCount(0);
});
test("sources remain unloaded until requested and video uses its timestamp", async ({
  page,
}) => {
  await readPerson(page, "Maya Ackerman");
  await expect(page.locator(reader + " iframe")).toHaveCount(0);
  await contextMode(page, "listen");
  await expect(page.locator(reader + " iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/.+\?start=\d+/,
  );
  await page.getByLabel("Close recording", { exact: true }).click();
  await expect(page.locator(reader + " iframe")).toHaveCount(0);
});

test("legacy source links still restore their reading screen", async ({
  page,
}) => {
  const key = "evidence:Nick Nadeau:06:18";
  await openQuestion(page);
  const stories = JSON.parse(
    (await page.locator("#record-journey-data").textContent())!,
  );
  const nick = stories.find((s) => s.key.startsWith("evidence:Nick Nadeau:"));
  await page.goto(
    recordPath + "?question=evidence&evidence=" + encodeURIComponent(nick.key),
  );
  await expect(page.locator(reader)).toContainText("Nick Nadeau");
  await page.reload();
  await expect(page.locator(reader)).toContainText("Nick Nadeau");
});
for (const width of [1280, 820])
  test(`comparison selectors align with their columns at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(recordPath + "?view=compare&question=understanding");
    for (const side of ["a", "b"]) {
      const pickerBox = await page
        .locator(`[data-person-picker="${side}"]`)
        .boundingBox();
      const columnBox = await page
        .locator(`.comparison-row:visible [data-compare-side="${side}"]`)
        .boundingBox();
      expect(Math.abs(pickerBox!.x - columnBox!.x)).toBeLessThan(2);
      expect(Math.abs(pickerBox!.width - columnBox!.width)).toBeLessThan(2);
    }
    await noOverflow(page);
  });
