import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';

export async function load({ params }) {
	const [product] = await db
		.select()
		.from(products)
		.where(and(eq(products.slug, params.slug), eq(products.active, true)));

	if (!product) {
		throw error(404, 'Produsul nu a fost găsit.');
	}

	return { product };
}
