import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

export function isStripeConfigured(): boolean {
	return !!env.STRIPE_SECRET_KEY;
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
	if (!_stripe) {
		_stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
			apiVersion: '2026-05-27.dahlia'
		});
	}
	return _stripe;
}
