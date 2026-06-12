import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for routes being created in later phases
				if (referrer && (
					path.startsWith('/blog') ||
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
