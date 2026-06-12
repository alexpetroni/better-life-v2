import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { isStripeConfigured, getStripe } from '$lib/server/stripe.js';
import { fulfillCheckoutSession } from '$lib/server/orders.js';

export async function POST({ request }) {
	if (!isStripeConfigured()) {
		throw error(503, 'Stripe not configured');
	}

	const sig = request.headers.get('stripe-signature');
	if (!sig) {
		throw error(400, 'Missing stripe-signature header');
	}

	const body = await request.text();
	const stripe = getStripe();

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET ?? '');
	} catch {
		throw error(400, 'Invalid webhook signature');
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		const result = await fulfillCheckoutSession(session);
		return json({ received: true, result });
	}

	return json({ received: true, result: 'ignored' });
}
