// [stripe-live] optional script — mirrors products to Stripe dashboard
process.loadEnvFile();
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';
if (!STRIPE_SECRET_KEY) {
	console.log('STRIPE_SECRET_KEY not set — skipping stripe-sync.');
	process.exit(0);
}

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(client, { schema: { products } });
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' });

const rows = await db.select().from(products).where(eq(products.active, true));

for (const product of rows) {
	let stripeProductId = product.stripe_product_id;

	if (stripeProductId) {
		await stripe.products.update(stripeProductId, { name: product.name });
		console.log(`Updated Stripe product: ${stripeProductId} (${product.slug})`);
	} else {
		const stripeProduct = await stripe.products.create({
			name: product.name,
			description: product.description
		});
		stripeProductId = stripeProduct.id;
		console.log(`Created Stripe product: ${stripeProductId} (${product.slug})`);
	}

	let stripePriceId = product.stripe_price_id;
	if (!stripePriceId) {
		const price = await stripe.prices.create({
			product: stripeProductId,
			unit_amount: product.price_cents,
			currency: 'ron'
		});
		stripePriceId = price.id;
		console.log(`Created Stripe price: ${stripePriceId}`);
	}

	await db
		.update(products)
		.set({ stripe_product_id: stripeProductId, stripe_price_id: stripePriceId })
		.where(eq(products.slug, product.slug));
}

console.log('Stripe sync complete.');
await client.end();
process.exit(0);
