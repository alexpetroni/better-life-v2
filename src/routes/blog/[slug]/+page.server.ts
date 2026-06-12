import { getAllPosts } from '$lib/blog.js';
import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { and, eq, inArray } from 'drizzle-orm';

export async function load({ params }) {
	// Find metadata to get relatedProducts
	const posts = getAllPosts();
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) return { relatedProductItems: [] };

	const slugs = post.metadata.relatedProducts ?? [];
	if (slugs.length === 0) return { relatedProductItems: [] };

	const rows = await db
		.select()
		.from(products)
		.where(and(inArray(products.slug, slugs), eq(products.active, true)));

	return { relatedProductItems: rows };
}
