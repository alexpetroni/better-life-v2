import { getTopic } from '$lib/content/topics.js';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { and, eq } from 'drizzle-orm';

export async function load({ params }) {
	const topic = getTopic(params.topic);
	if (!topic) {
		throw error(404, 'Domeniu negăsit');
	}

	const topicProducts = await db
		.select()
		.from(products)
		.where(and(eq(products.topic, params.topic), eq(products.active, true)));

	return { topic, products: topicProducts };
}
