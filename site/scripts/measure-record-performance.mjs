import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const origin of [
  process.env.RECORD_LOCAL_ORIGIN || "http://127.0.0.1:4402",
  "https://innovatingfuture.com",
]) {
  for (let sample = 0; sample < 3; sample++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      const start = performance.now();
      const response = await page.goto(
        origin + "/work/coexisting-with-ai/record/",
        { waitUntil: "load", timeout: 30000 },
      );
      await page.locator(".report-enter").waitFor();
      const entry = await page.evaluate(() => {
        const n = performance.getEntriesByType("navigation")[0];
        return {
          ttfb: n.responseStart,
          domReady: n.domContentLoadedEventEnd,
          transferBytes: n.transferSize,
          paints: performance.getEntriesByType("paint").map(p=>({name:p.name,ms:p.startTime})),
        };
      });
      const clickStart = performance.now();
      await page.locator(".report-enter").click();
      await page
        .locator(".explore-welcome")
        .waitFor({ state: "visible", timeout: 15000 });
      const openMs = performance.now() - clickStart;
      const backStart = performance.now();
      await page.goBack({ waitUntil: "load", timeout: 15000 });
      await page
        .locator(".report-enter")
        .waitFor({ state: "visible", timeout: 15000 });
      results.push({
        origin,
        sample,
        status: response.status(),
        entry,
        openMs,
        backMs: performance.now() - backStart,
        errors,
      });
    } catch (error) {
      results.push({ origin, sample, error: error.message, errors });
    }
    await context.close();
  }
}
await mkdir("audit-results", { recursive: true });
await writeFile(
  "audit-results/performance.json",
  JSON.stringify({ measuredAt: new Date().toISOString(), results }, null, 2),
);
console.log(JSON.stringify(results));
await browser.close();
