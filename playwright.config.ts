import { defineConfig, devices } from '@playwright/test';

// Dedicated port so e2e runs don't collide with a dev server on 5173.
const PORT = 4173;

export default defineConfig({
	testDir: 'e2e',
	timeout: 30_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	// Boots the SvelteKit dev server for the test run (needs Postgres on 5433 up).
	webServer: {
		command: `npx vite dev --port ${PORT}`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000
	}
});
