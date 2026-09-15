import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: ["record-entry.spec.ts", "record-horizontal.spec.ts"],
  workers: 1,
  use: { baseURL: "http://localhost:4321", channel: "chrome", headless: true },
  reporter: "line",
});
