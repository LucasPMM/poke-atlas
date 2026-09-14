import { env } from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const basePath = env.GITHUB_PAGES_BASE ?? '/poke-atlas/'
const baseURL = new URL(basePath, 'http://127.0.0.1:4174').toString()

export default defineConfig({
  testDir: './e2e',
  testMatch: 'pages.spec.ts',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(env.CI),
  retries: env.CI ? 2 : 0,
  reporter: env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-320-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 320, height: 720 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true
      }
    }
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4174 --strictPort',
    url: baseURL,
    reuseExistingServer: !env.CI,
    timeout: 60_000
  }
})
