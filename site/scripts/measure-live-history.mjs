import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome", headless: true });
const records = [];
for (let sample = 0; sample < 3; sample++) {
  const context = await b.newContext();
  const p = await context.newPage();
  await p.goto("https://innovatingfuture.com/work/coexisting-with-ai/record/", {
    waitUntil: "domcontentloaded",
  });
  const link = await p
    .locator(".report-enter")
    .evaluate((n) => ({ href: n.href, target: n.target }));
  const start = performance.now();
  await p.locator(".report-enter").click();
  await p.waitForTimeout(1800);
  const click = await p.evaluate(() => ({
    url: location.href,
    welcomeVisible:
      !!document.querySelector(".explore-welcome") &&
      getComputedStyle(document.querySelector(".explore-welcome")).display !==
        "none",
    curtain: !!document.querySelector(
      ".record-entry-curtain,.record-entry-launch",
    ),
    text: document.body.innerText.slice(-350),
  }));
  const clickMs = performance.now() - start;
  let back = null;
  if (p.url().includes("/explore")) {
    const start = performance.now();
    await p.goBack({ waitUntil: "domcontentloaded" });
    await p.waitForTimeout(200);
    back = {
      ms: performance.now() - start,
      ...(await p.evaluate(() => ({
        url: location.href,
        text: document.body.innerText.slice(-250),
        launch: !!document.querySelector(".record-entry-launch"),
      }))),
    };
  }
  records.push({ sample, link, click, clickMs, back });
  await context.close();
}
await writeFile(
  "audit-results/live-history.json",
  JSON.stringify({ measuredAt: new Date().toISOString(), records }, null, 2),
);
console.log(JSON.stringify(records));
await b.close();
