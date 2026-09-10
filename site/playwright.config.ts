import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4399',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: 'node scripts/serve-built.mjs',
    url: 'http://127.0.0.1:4399',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
