import { db } from '$lib/server/db/client.js';
import { subscribers } from '$lib/server/db/schema.js';
import { verifyToken } from '$lib/server/tokens.js';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types.js';

export async function load({ params }: { params: { token: string } }) {
	const payload = verifyToken(params.token, 'unsub');
	if (!payload) {
		return { success: false as const };
	}

	await db
		.update(subscribers)
		.set({ status: 'unsubscribed', unsubscribed_at: new Date() })
		.where(eq(subscribers.id, payload.sub));

	return { success: true as const };
}

export const actions: Actions = {
	default: async ({ params }) => {
		const payload = verifyToken(params.token, 'unsub');
		if (!payload) {
			return { success: false };
		}

		await db
			.update(subscribers)
			.set({ status: 'unsubscribed', unsubscribed_at: new Date() })
			.where(eq(subscribers.id, payload.sub));

		return { success: true };
	}
};
