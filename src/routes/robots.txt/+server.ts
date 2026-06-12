import { env } from '$env/dynamic/private';

// Serve dynamically — env.PUBLIC_SITE_URL not available at build time
export const prerender = false;

export function GET() {
	const siteUrl = (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

	const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /email/
Disallow: /download/
Disallow: /cart
Disallow: /checkout

Sitemap: ${siteUrl}/sitemap.xml
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
