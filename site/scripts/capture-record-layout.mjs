import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const label = process.argv[2] || "before";
await mkdir(`/tmp/cif-refactor-${label}`, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const geometry = {};
for (const [name, query] of [
  ["welcome", ""],
  ["picker", "?question=evidence&choose=1"],
  ["follow", "?view=follow"],
  ["about", "?view=about"],
]) {
  await page.goto(
    (process.env.RECORD_ORIGIN || "http://127.0.0.1:4402") +
      "/work/coexisting-with-ai/record/explore/" +
      query,
  );
  await page.waitForTimeout(300);
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `/tmp/cif-refactor-${label}/${name}.png` });
  geometry[name] = await page
    .locator(
      ".topbar,.welcome-layout,.journey-screen-picker:visible,.people-view:visible,.about-view:visible",
    )
    .evaluateAll((ns) =>
      ns.map((n) => ({
        class: n.className,
        x: n.getBoundingClientRect().x,
        y: n.getBoundingClientRect().y,
        w: n.getBoundingClientRect().width,
        h: n.getBoundingClientRect().height,
      })),
    );
}
await writeFile(
  `/tmp/cif-refactor-${label}/geometry.json`,
  JSON.stringify(geometry),
);
await browser.close();
