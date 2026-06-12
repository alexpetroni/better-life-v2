import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load() {
	const rows = await db.select().from(products).where(eq(products.active, true));
	return { products: rows };
}
