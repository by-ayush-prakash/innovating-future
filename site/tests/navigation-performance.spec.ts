import { test, expect } from "@playwright/test";
const explore = "/work/coexisting-with-ai/record/explore/";
const picker = ".journey-screen-picker:visible",
  reader = ".record-perspective:visible";
async function readNick(page) {
  await page.goto(explore + "?question=evidence&choose=1");
  await page
    .locator(picker)
    .getByLabel("Read Nick Nadeau’s perspective", { exact: true })
    .click();
  await expect(page.locator(reader)).toContainText("Nick Nadeau");
}
async function journey(page) {
  await page.locator(".journey-screen-steps:visible>summary").click();
  return page.locator(".journey-screen-steps:visible");
}
test("entry and browser history never restore a blocking curtain", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/work/coexisting-with-ai/record/");
  await page.locator(".report-enter").click();
  await expect(page.locator(".explore-welcome")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".report-enter")).toBeVisible();
  await expect(
    page.locator(".record-entry-launch,.record-entry-curtain"),
  ).toHaveCount(0);
  await page.goForward();
  await expect(page.locator(".explore-welcome")).toBeVisible();
  expect(errors).toEqual([]);
});
test("one collection, all questions open and only its grid scrolls", async ({
  page,
}) => {
  await page.goto(explore);
  const cards = page.locator(".welcome-card");
  await expect(cards).toHaveCount(10);
  const ids = await cards.evaluateAll((ns) =>
    ns.map((n) =>
      new URL((n as HTMLAnchorElement).href).searchParams.get("question"),
    ),
  );
  expect(new Set(ids).size).toBe(10);
  const sizing = await page
    .locator(".welcome-card-grid")
    .evaluate((n) => ({
      scroll: n.scrollHeight,
      client: n.clientHeight,
      page: document.documentElement.scrollHeight,
      height: innerHeight,
    }));
  expect(sizing.scroll).toBeGreaterThan(sizing.client);
  expect(sizing.page).toBeLessThanOrEqual(sizing.height + 1);
  for (const id of ids) {
    await page.goto(explore + "?question=" + id);
    await expect(page.locator(picker)).toHaveCount(1);
    await expect(page.locator(picker + " .onward-source")).toHaveCount(3);
  }
});
test("another person excludes Nick and Journey survives reload", async ({
  page,
}) => {
  await readNick(page);
  await page
    .getByRole("button", { name: "See another perspective →", exact: true })
    .click();
  await expect(
    page
      .locator(picker)
      .getByLabel("Read Nick Nadeau’s perspective", { exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(picker + " .onward-source")).toHaveCount(2);
  let menu = await journey(page);
  await expect(
    menu.getByRole("button", { name: "See another perspective", exact: true }),
  ).toBeDisabled();
  await menu.locator("summary").click();
  await page
    .locator(picker)
    .getByLabel("Read Maya Ackerman’s perspective", { exact: true })
    .click();
  await expect(page.locator(reader)).toContainText("Maya Ackerman");
  await expect(page.locator(reader + " .reading-next-steps")).toBeVisible();
  await page.reload();
  menu = await journey(page);
  await expect(
    menu.getByRole("button", { name: "Maya Ackerman", exact: true }),
  ).toBeDisabled();
  await menu.getByRole("button", { name: "Nick Nadeau", exact: true }).click();
  await expect(page.locator(reader)).toContainText("Nick Nadeau");
});
test("reflection keeps notes and choice through Back", async ({ page }) => {
  await readNick(page);
  await page
    .getByRole("button", { name: "Reflect on this →", exact: true })
    .click();
  const response = page.locator(".reflection-option:visible").first();
  await response.click();
  await expect(response).toHaveAttribute("aria-pressed", "true");
  await page
    .getByLabel("Your own thoughts (optional)", { exact: true })
    .fill("A local regression-check note");
  const proceed = page.getByRole("button", {
    name: "Continue to connected ideas →",
    exact: true,
  });
  await expect(proceed).toBeInViewport();
  await proceed.click();
  await expect(page.locator(".reflection-next:visible")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".journey-reflection:visible")).toBeVisible();
  await expect(
    page.getByLabel("Your own thoughts (optional)", { exact: true }),
  ).toHaveValue("A local regression-check note");
  await expect(
    page.locator(".reflection-option:visible").first(),
  ).toHaveAttribute("aria-pressed", "true");
});
test("rapid Follow and About cannot be overwritten by late effects", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(explore);
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page.locator("[data-people-group]:visible > summary").first().click();
  await page.locator("[data-open-person]:visible").first().click();
  await page.getByRole("button", { name: "About", exact: true }).click();
  await expect(page.locator(".about-view")).toBeVisible();
  await page.goBack();
  await expect(page.locator("[data-person-view]:visible")).toHaveCount(1);
  await page.goForward();
  await expect(page.locator(".about-view")).toBeVisible();
  expect(errors).toEqual([]);
});
test("source passage loads once and close mark has no underline", async ({
  page,
}) => {
  await readNick(page);
  const requests = [];
  page.on("request", (r) => {
    if (r.url().includes("/sources/")) requests.push(r.url());
  });
  await page.locator(reader + " [data-context-toggle]").click();
  await page.locator(reader + " [data-context-read]").click();
  await expect(page.locator(".reading-turns:visible")).not.toContainText(
    "Loading",
  );
  await page.getByLabel("Close conversation", { exact: true }).click();
  await page.locator(reader + " [data-context-toggle]").click();
  await page.locator(reader + " [data-context-read]").click();
  expect(requests.length).toBe(1);
  const geometry = await page
    .getByLabel("Close conversation", { exact: true })
    .evaluate((n) => ({
      width: n.clientWidth,
      height: n.clientHeight,
      border: getComputedStyle(n).borderBottomWidth,
    }));
  expect(geometry.width).toBe(geometry.height);
  expect(geometry.border).toBe("0px");
});
test("main site pages and lazy search index respond", async ({ request }) => {
  for (const path of [
    "/",
    "/work/coexisting-with-ai/record/",
    "/podcast/",
    "/team/",
    "/media/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/work/ai-native-generation/",
  ]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
  }
  const r = await request.get("/work/coexisting-with-ai/record/search.json");
  expect(r.status()).toBe(200);
  expect(Object.keys(await r.json()).length).toBeGreaterThan(90);
});

test("Back restores a question after visiting Follow", async ({ page }) => {
  await page.goto(explore + "?question=evidence&choose=1");
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page.locator("[data-people-group]:visible > summary").first().click();
  await expect(
    page.locator("[data-open-person]:visible").first(),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator(picker)).toBeVisible();
  await expect(page.locator(picker)).toContainText("Nick Nadeau");
});

test("mobile reflection stays usable without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await readNick(page);
  await page
    .getByRole("button", { name: "Reflect on this →", exact: true })
    .click();
  await page
    .getByLabel("Your own thoughts (optional)", { exact: true })
    .fill("Mobile note");
  await page
    .getByRole("button", { name: "Continue to connected ideas →", exact: true })
    .scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/mobile-reflection.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Continue to connected ideas →", exact: true })
    .click();
  await expect(page.locator(".reflection-next:visible")).toBeVisible();
});
test("reduced motion leaves no running entrance effects", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(explore);
  await page
    .locator(".welcome-card")
    .filter({ hasText: "When should we trust" })
    .click();
  await expect(page.locator(picker)).toBeVisible();
  expect(
    await page.locator(".prototype").evaluate((n) =>
      n
        .getAnimations({ subtree: true })
        .filter((a) => a.playState === "running")
        .map((a) => ({
          name: (a as CSSAnimation).animationName,
          target: (a.effect as KeyframeEffect).target?.outerHTML.slice(0, 180),
        })),
    ),
  ).toEqual([]);
  await page.screenshot({ path: "test-results/desktop-picker.png" });
});
