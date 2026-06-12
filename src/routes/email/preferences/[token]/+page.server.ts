import { db } from '$lib/server/db/client.js';
import { subscribers } from '$lib/server/db/schema.js';
import { verifyToken } from '$lib/server/tokens.js';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';

export async function load({ params }) {
	const payload = verifyToken(params.token, 'prefs');
	if (!payload) {
		return { valid: false as const, subscriber: null };
	}

	const results = await db
		.select()
		.from(subscribers)
		.where(eq(subscribers.id, payload.sub))
		.limit(1);

	if (results.length === 0) {
		return { valid: false as const, subscriber: null };
	}

	return { valid: true as const, subscriber: results[0] };
}

export const actions: Actions = {
	default: async ({ params, request }) => {
		const payload = verifyToken(params.token, 'prefs');
		if (!payload) {
			return fail(400, { error: 'Token invalid' });
		}

		const formData = await request.formData();
		const cadence = formData.get('cadence') as string;

		if (!['weekly', 'monthly', 'none'].includes(cadence)) {
			return fail(400, { error: 'Cadență invalidă' });
		}

		await db
			.update(subscribers)
			.set({ cadence })
			.where(eq(subscribers.id, payload.sub));

		return { success: true };
	}
};
