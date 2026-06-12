import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type Stripe from 'stripe';
import { db } from '$lib/server/db/client.js';
import { products } from '$lib/server/db/schema.js';
import { isStripeConfigured, getStripe } from '$lib/server/stripe.js';
import { standardShipping, FREE_SHIPPING_THRESHOLD_CENTS } from '$lib/content/shipping.js';
import { inArray } from 'drizzle-orm';

export async function POST({ request }) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (
		typeof body !== 'object' ||
		body === null ||
		!Array.isArray((body as Record<string, unknown>).items)
	) {
		throw error(400, 'Missing items array');
	}

	const rawItems = (body as { items: unknown[] }).items;

	if (rawItems.length === 0) {
		throw error(400, 'Cart is empty');
	}

	if (rawItems.length > 8) {
		throw error(400, 'Too many distinct products (max 8)');
	}

	const parsedItems: Array<{ productId: string; quantity: number }> = [];
	for (const item of rawItems) {
		if (
			typeof item !== 'object' ||
			item === null ||
			typeof (item as Record<string, unknown>).productId !== 'string' ||
			typeof (item as Record<string, unknown>).quantity !== 'number'
		) {
			throw error(400, 'Invalid item format');
		}
		const { productId, quantity } = item as { productId: string; quantity: number };
		if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
			throw error(400, 'Quantity must be 1–10');
		}
		parsedItems.push({ productId, quantity });
	}

	const productIds = parsedItems.map((i) => i.productId);
	const dbProducts = await db
		.select()
		.from(products)
		.where(inArray(products.id, productIds));

	if (dbProducts.length !== productIds.length) {
		throw error(400, 'One or more products not found');
	}
	if (dbProducts.some((p) => !p.active)) {
		throw error(400, 'One or more products are unavailable');
	}

	if (!isStripeConfigured()) {
		return json({ error: 'Payments are not yet configured' }, { status: 503 });
	}

	const stripe = getStripe();
	const productMap = new Map(dbProducts.map((p) => [p.id, p]));
	const hasPhysical = dbProducts.some((p) => p.type === 'physical');

	const totalCents = parsedItems.reduce((sum, { productId, quantity }) => {
		const p = productMap.get(productId);
		return sum + (p?.price_cents ?? 0) * quantity;
	}, 0);

	const lineItems = parsedItems.map(({ productId, quantity }) => {
		const p = productMap.get(productId)!;
		return {
			quantity,
			price_data: {
				currency: 'ron' as const,
				unit_amount: p.price_cents,
				tax_behavior: 'inclusive' as const,
				product_data: { name: p.name }
			}
		};
	});

	const metaItems = parsedItems.map(({ productId, quantity }) => `${productId}:${quantity}`).join(',');

	const siteUrl = (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

	const shippingOption: Stripe.Checkout.SessionCreateParams.ShippingOption = hasPhysical
		? totalCents >= FREE_SHIPPING_THRESHOLD_CENTS
			? {
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: { amount: 0, currency: 'ron' },
						display_name: 'Livrare gratuită'
					}
				}
			: {
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: { amount: standardShipping.priceCents, currency: 'ron' },
						display_name: standardShipping.label
					}
				}
		: null!;

	const sessionParams: Stripe.Checkout.SessionCreateParams = {
		mode: 'payment',
		locale: 'ro',
		line_items: lineItems,
		automatic_tax: { enabled: true },
		customer_creation: 'if_required',
		metadata: { items: metaItems },
		success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${siteUrl}/checkout/cancel`,
		...(hasPhysical
			? {
					shipping_address_collection: { allowed_countries: ['RO'] },
					shipping_options: [shippingOption]
				}
			: {})
	};

	const session = await stripe.checkout.sessions.create(sessionParams);

	return json({ url: session.url });
}
