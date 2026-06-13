import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	kit: {
		// Run serverless functions in Frankfurt, next to the Neon (EU) database —
		// avoids a transatlantic round-trip on every query for an RO/EU audience.
		adapter: adapter({ regions: ['fra1'] }),
		prerender: {
			handleUnseenRoutes: 'ignore',
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for routes being created in later phases
				if (referrer && (
					path.startsWith('/termeni') ||
					path === '/quiz/obiceiuri'
				)) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
