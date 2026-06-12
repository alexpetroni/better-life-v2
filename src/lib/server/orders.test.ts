import { afterAll, describe, expect, it } from 'vitest';
import type Stripe from 'stripe';
import { db } from './db/client.js';
import { orders, order_items, download_tokens, email_sends, products } from './db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { fulfillCheckoutSession, parseItemsMetadata } from './orders.js';

// Fetch physical and digital product IDs from DB
const allProducts = await db
	.select({ id: products.id, slug: products.slug, type: products.type })
	.from(products);

const physicalProduct = allProducts.find((p) => p.type === 'physical')!;
const digitalProduct = allProducts.find((p) => p.type === 'digital')!;

function makeSession(
	overrides: Partial<Stripe.Checkout.Session> = {}
): Stripe.Checkout.Session {
	return {
		id: 'cs_test_' + crypto.randomUUID(),
		object: 'checkout.session',
		customer_details: { email: 'order@example.com', name: null, phone: null, tax_exempt: 'none', tax_ids: [] },
		amount_total: physicalProduct ? 8900 + 4900 : 4900,
		currency: 'ron',
		payment_intent: 'pi_test_x',
		metadata: {
			items: `${physicalProduct?.id}:1,${digitalProduct?.id}:1`
		},
		collected_information: {
			shipping_details: {
				address: {
					city: 'București',
					country: 'RO',
					line1: 'Str. Exemplu 1',
					line2: null,
					postal_code: '010001',
					state: null
				},
				name: 'Test User'
			}
		},
		...overrides
	} as unknown as Stripe.Checkout.Session;
}

const testSessionIds: string[] = [];

describe('parseItemsMetadata', () => {
	it('parses valid items string', () => {
		const result = parseItemsMetadata('abc:1,def:2');
		expect(result).toEqual([
			{ productId: 'abc', quantity: 1 },
			{ productId: 'def', quantity: 2 }
		]);
	});

	it('returns null for empty string', () => {
		expect(parseItemsMetadata('')).toBeNull();
	});

	it('returns null for malformed pair', () => {
		expect(parseItemsMetadata('abc')).toBeNull();
	});

	it('returns null for zero quantity', () => {
		expect(parseItemsMetadata('abc:0')).toBeNull();
	});
});

describe('fulfillCheckoutSession', () => {
	it('creates order + items + download token + emails on first call', async () => {
		const session = makeSession();
		testSessionIds.push(session.id);

		const result = await fulfillCheckoutSession(session);
		expect(result).toBe('fulfilled');

		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.stripe_session_id, session.id));
		expect(order).toBeDefined();
		expect(order.email).toBe('order@example.com');

		const items = await db
			.select()
			.from(order_items)
			.where(eq(order_items.order_id, order.id));
		expect(items).toHaveLength(2);

		const tokens = await db
			.select()
			.from(download_tokens)
			.where(
				inArray(
					download_tokens.order_item_id,
					items.map((i) => i.id)
				)
			);
		expect(tokens).toHaveLength(1);

		const emailRows = await db
			.select()
			.from(email_sends)
			.where(
				inArray(email_sends.email_key, [`order:${order.id}`, `delivery:${order.id}`])
			);
		expect(emailRows.length).toBeGreaterThanOrEqual(2);
	});

	it('returns duplicate on second call with same session id', async () => {
		const session = makeSession();
		testSessionIds.push(session.id);

		await fulfillCheckoutSession(session);
		const countBefore = (await db.select().from(orders)).length;

		const result2 = await fulfillCheckoutSession(session);
		expect(result2).toBe('duplicate');

		const countAfter = (await db.select().from(orders)).length;
		expect(countAfter).toBe(countBefore);
	});

	it('returns invalid and creates order but no items for garbage metadata', async () => {
		const session = makeSession({
			metadata: { items: 'garbage' }
		} as Partial<Stripe.Checkout.Session>);
		testSessionIds.push(session.id);

		const result = await fulfillCheckoutSession(session);
		expect(result).toBe('invalid');

		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.stripe_session_id, session.id));
		expect(order).toBeDefined();

		const items = await db
			.select()
			.from(order_items)
			.where(eq(order_items.order_id, order.id));
		expect(items).toHaveLength(0);
	});
});

afterAll(async () => {
	if (testSessionIds.length === 0) return;

	const testOrders = await db
		.select({ id: orders.id })
		.from(orders)
		.where(inArray(orders.stripe_session_id, testSessionIds));

	const orderIds = testOrders.map((o) => o.id);
	if (orderIds.length === 0) return;

	const testItems = await db
		.select({ id: order_items.id })
		.from(order_items)
		.where(inArray(order_items.order_id, orderIds));

	const itemIds = testItems.map((i) => i.id);
	if (itemIds.length > 0) {
		await db
			.delete(download_tokens)
			.where(inArray(download_tokens.order_item_id, itemIds));
		await db
			.delete(order_items)
			.where(inArray(order_items.order_id, orderIds));
	}

	const emailKeys = orderIds.flatMap((id) => [`order:${id}`, `delivery:${id}`]);
	await db
		.delete(email_sends)
		.where(inArray(email_sends.email_key, emailKeys));

	await db
		.delete(orders)
		.where(inArray(orders.stripe_session_id, testSessionIds));
});
