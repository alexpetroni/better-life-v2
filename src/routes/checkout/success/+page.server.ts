import { isStripeConfigured, getStripe } from '$lib/server/stripe.js';

export async function load({ url }) {
	const sessionId = url.searchParams.get('session_id');

	if (!sessionId || !isStripeConfigured()) {
		return { summary: null };
	}

	try {
		const stripe = getStripe();
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items']
		});
		return {
			summary: {
				email: session.customer_details?.email ?? null,
				amountTotal: session.amount_total,
				currency: session.currency
			}
		};
	} catch {
		return { summary: null };
	}
}
