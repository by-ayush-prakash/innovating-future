import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "navigation-performance.spec.ts",
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4402",
    channel: "chrome",
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "PORT=4402 node scripts/serve-built.mjs",
    url: "http://127.0.0.1:4402",
    reuseExistingServer: false,
  },
});
