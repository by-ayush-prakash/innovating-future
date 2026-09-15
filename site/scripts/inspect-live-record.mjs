import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const measurements = [];
for (const route of [
  "/work/coexisting-with-ai/record/",
  "/work/coexisting-with-ai/record/explore/",
]) {
  await p.goto("https://innovatingfuture.com" + route, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await p.waitForTimeout(1500);
  measurements.push(
    await p.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0];
      return {
        url: location.href,
        ttfb: n.responseStart,
        domReady: n.domContentLoadedEventEnd,
        transferBytes: n.transferSize,
        paints: performance
          .getEntriesByType("paint")
          .map((p) => ({ name: p.name, ms: p.startTime })),
        welcomeVisible:
          !!document.querySelector(".explore-welcome") &&
          getComputedStyle(document.querySelector(".explore-welcome"))
            .display !== "none",
        bodyText: document.body.innerText.slice(0, 1400),
        styles: [...document.querySelectorAll("link[rel=stylesheet]")].map(
          (n) => n.href,
        ),
      };
    }),
  );
}
await p.screenshot({ path: "audit-results/live-explore.png" });
await writeFile(
  "audit-results/live-inspection.json",
  JSON.stringify(
    { measuredAt: new Date().toISOString(), measurements, errors },
    null,
    2,
  ),
);
console.log(JSON.stringify({ measurements, errors }));
await b.close();
