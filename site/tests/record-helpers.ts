import { expect, type Page } from "@playwright/test";
export const recordPath = "/work/coexisting-with-ai/record/explore/";
export const picker = ".journey-screen-picker:visible",
  reader = ".record-perspective:visible";
export async function openQuestion(page: Page, id = "evidence") {
  await page.goto(recordPath + "?question=" + id + "&choose=1");
  await expect(page.locator(picker)).toBeVisible();
}
export async function readPerson(
  page: Page,
  name = "Nick Nadeau",
  id = "evidence",
) {
  await openQuestion(page, id);
  await page
    .locator(picker)
    .getByLabel(`Read ${name}’s perspective`, { exact: true })
    .click();
  await expect(page.locator(reader)).toContainText(name);
}
export async function contextMode(page: Page, mode: "read" | "listen") {
  await page.locator(reader + " [data-context-toggle]").click();
  await page
    .locator(
      reader +
        (mode === "read" ? " [data-context-read]" : " [data-inspector-video]"),
    )
    .click();
  await expect(
    page.locator(
      mode === "read"
        ? reader + " .reading-context-slot"
        : reader + " .reading-recording",
    ),
  ).toBeVisible();
}
export async function reflect(page: Page) {
  await page
    .getByRole("button", { name: "Reflect on this →", exact: true })
    .click();
  await expect(page.locator(".journey-reflection:visible")).toBeVisible();
}
export async function continueReflection(page: Page) {
  const b = page.getByRole("button", {
    name: "Continue to connected ideas →",
    exact: true,
  });
  await b.scrollIntoViewIfNeeded();
  await b.click();
  await expect(page.locator(".reflection-next:visible")).toBeVisible();
}
export async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
}
