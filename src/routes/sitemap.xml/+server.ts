import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { getAllPosts } from '$lib/blog.js';
import { topics } from '$lib/content/topics.js';
import { allQuizzes } from '$lib/content/quizzes/index.js';
import { eq } from 'drizzle-orm';

// NOT prerendered — DB access at runtime
export const prerender = false;

export async function GET() {
	const siteUrl = (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

	const staticPages = ['/', '/blog', '/shop'];
	const topicSlugs = topics.map((t) => t.slug);
	const quizSlugs = allQuizzes.map((q) => q.slug);
	const posts = getAllPosts().map((p) => p.slug);
	const activeProducts = await db
		.select({ slug: products.slug })
		.from(products)
		.where(eq(products.active, true));

	const urls: string[] = [
		...staticPages.map((p) => `${siteUrl}${p}`),
		...topicSlugs.map((t) => `${siteUrl}/topics/${t}`),
		...quizSlugs.map((q) => `${siteUrl}/quiz/${q}`),
		...posts.map((s) => `${siteUrl}/blog/${s}`),
		...activeProducts.map((p) => `${siteUrl}/shop/${p.slug}`)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
