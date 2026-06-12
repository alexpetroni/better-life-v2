import { randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import type Stripe from 'stripe';
import { db } from './db/client.js';
import { orders, order_items, download_tokens, products } from './db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { sendEmail } from './email/send.js';
import { orderConfirmEmail } from './email/templates/order-confirm.js';
import { deliveryEmail } from './email/templates/delivery.js';

export interface ParsedItem {
	productId: string;
	quantity: number;
}

export function parseItemsMetadata(s: string): ParsedItem[] | null {
	try {
		if (!s || typeof s !== 'string') return null;
		const pairs = s.split(',');
		const result: ParsedItem[] = [];
		for (const pair of pairs) {
			const [productId, qtyStr] = pair.split(':');
			if (!productId || !qtyStr) return null;
			const quantity = parseInt(qtyStr, 10);
			if (!Number.isInteger(quantity) || quantity < 1) return null;
			result.push({ productId, quantity });
		}
		return result.length > 0 ? result : null;
	} catch {
		return null;
	}
}

function siteUrl(): string {
	return (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
}

export async function fulfillCheckoutSession(
	session: Stripe.Checkout.Session
): Promise<'fulfilled' | 'duplicate' | 'invalid'> {
	const shippingAddress =
		session.collected_information?.shipping_details?.address ??
		(session as unknown as { shipping_details?: { address?: unknown } }).shipping_details
			?.address ??
		null;

	const inserted = await db
		.insert(orders)
		.values({
			stripe_session_id: session.id,
			email: session.customer_details?.email ?? null,
			status: 'paid',
			amount_total: session.amount_total ?? null,
			currency: session.currency ?? null,
			shipping_address: (shippingAddress as Record<string, unknown>) ?? null
		})
		.onConflictDoNothing()
		.returning({ id: orders.id });

	if (inserted.length === 0) {
		return 'duplicate';
	}

	const orderId = inserted[0].id;

	const rawItems = session.metadata?.items;
	if (!rawItems) {
		console.error(`[orders] session ${session.id} has no metadata.items`);
		return 'invalid';
	}

	const parsedItems = parseItemsMetadata(rawItems);
	if (!parsedItems) {
		console.error(`[orders] session ${session.id} malformed metadata.items: ${rawItems}`);
		return 'invalid';
	}

	const productIds = parsedItems.map((i) => i.productId);
	const dbProducts = await db
		.select()
		.from(products)
		.where(inArray(products.id, productIds));

	const productMap = new Map(dbProducts.map((p) => [p.id, p]));

	const orderItemInserts = [];
	const digitalItems: Array<{ itemId: string; product: typeof dbProducts[0] }> = [];

	for (const { productId, quantity } of parsedItems) {
		const product = productMap.get(productId);
		if (!product) continue;

		const [insertedItem] = await db
			.insert(order_items)
			.values({
				order_id: orderId,
				product_id: product.id,
				quantity,
				unit_amount: product.price_cents,
				type: product.type
			})
			.returning({ id: order_items.id });

		orderItemInserts.push(insertedItem);

		if (product.type === 'digital' && insertedItem) {
			digitalItems.push({ itemId: insertedItem.id, product });
		}
	}

	const downloadLinks: Array<{ productName: string; url: string }> = [];

	for (const { itemId, product } of digitalItems) {
		const token = randomBytes(32).toString('base64url');
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await db.insert(download_tokens).values({
			token,
			order_item_id: itemId,
			expires_at: expiresAt,
			max_downloads: 5,
			download_count: 0
		});

		downloadLinks.push({
			productName: product.name,
			url: `${siteUrl()}/download/${token}`
		});
	}

	if (downloadLinks.length > 0 && session.customer_details?.email) {
		await sendEmail({
			emailKey: `delivery:${orderId}`,
			to: session.customer_details.email,
			subject: 'Descarcă-ți produsele de la Viață Mai Bună',
			html: deliveryEmail({ links: downloadLinks })
		});
	}

	if (session.customer_details?.email) {
		const itemsForEmail = parsedItems
			.map(({ productId, quantity }) => {
				const p = productMap.get(productId);
				if (!p) return null;
				return { name: p.name, quantity, unit_amount: p.price_cents };
			})
			.filter((x): x is NonNullable<typeof x> => x !== null);

		await sendEmail({
			emailKey: `order:${orderId}`,
			to: session.customer_details.email,
			subject: 'Confirmare comandă — Viață Mai Bună',
			html: orderConfirmEmail({
				orderId,
				email: session.customer_details.email,
				items: itemsForEmail,
				amountTotal: session.amount_total ?? 0,
				currency: session.currency ?? 'ron',
				shippingAddress: (shippingAddress as Record<string, string | null>) ?? null
			})
		});
	}

	return 'fulfilled';
}
