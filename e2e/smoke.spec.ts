import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke tests: load every key page and the full quiz funnel in a real browser,
 * failing on ANY uncaught exception or console error. Curl-based checks only
 * exercise server-side rendering, so they cannot catch client hydration bugs
 * (e.g. an orphan $effect crashing on mount). These do.
 */

// Benign noise to ignore. Analytics is dev-guarded, so this stays short.
const IGNORE = [/favicon/i, /_vercel\/insights/i];

function watchErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
	page.on('console', (msg) => {
		if (msg.type() !== 'error') return;
		const text = msg.text();
		if (IGNORE.some((re) => re.test(text))) return;
		errors.push(`console.error: ${text}`);
	});
	return errors;
}

// Every page renders the layout header, so this string proves the shell mounted.
const SITE_NAME = 'Viață Mai Bună';

const PAGES = [
	'/',
	'/blog',
	'/blog/rutina-de-seara-in-7-pasi',
	'/shop',
	'/shop/masca-somn',
	'/shop/ghid-seara-linistita',
	'/cart',
	'/quiz/somn',
	'/quiz/obiceiuri',
	'/topics/somn',
	'/privacy',
	'/termeni'
];

for (const path of PAGES) {
	test(`no client errors: ${path}`, async ({ page }) => {
		const errors = watchErrors(page);
		const res = await page.goto(path, { waitUntil: 'load' });
		expect(res?.status(), `HTTP status for ${path}`).toBeLessThan(400);
		await expect(page.getByRole('banner')).toContainText(SITE_NAME);
		// let hydration run and throw if it's going to
		await page.waitForTimeout(400);
		expect(errors, `client errors on ${path}`).toEqual([]);
	});
}

test('quiz funnel: somn end-to-end', async ({ page }) => {
	const errors = watchErrors(page);

	await page.goto('/quiz/somn', { waitUntil: 'load' });
	await page.getByRole('link', { name: 'Începe testul' }).click();
	await expect(page).toHaveURL(/\/quiz\/somn\/play/);

	// Answer every question by clicking the first option; on the last question
	// clicking an option reveals "Continuă →" instead of advancing.
	for (let i = 0; i < 25; i++) {
		if (await page.locator('#email-input').count()) break;
		const cont = page.getByRole('button', { name: /Continuă/ });
		if (await cont.count()) {
			await cont.click();
			continue;
		}
		await page.getByTestId('quiz-option').first().click();
	}

	await expect(page.locator('#email-input')).toBeVisible();
	// Unique address per run: avoids the per-recipient daily results-email cap.
	await page.locator('#email-input').fill(`e2e-${Date.now()}@example.com`);
	await page.getByRole('button', { name: /Trimite rezultatele/ }).click();

	// EMAIL_DRYRUN=1 + a fresh address ⇒ a result token is issued and we redirect.
	await expect(page).toHaveURL(/\/quiz\/somn\/results/);
	await expect(page.getByRole('banner')).toContainText(SITE_NAME);

	expect(errors, 'client errors during quiz funnel').toEqual([]);
});
