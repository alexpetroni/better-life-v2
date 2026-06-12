import { db } from '$lib/server/db/client.js';
import { subscribers } from '$lib/server/db/schema.js';
import { verifyToken } from '$lib/server/tokens.js';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const payload = verifyToken(params.token, 'confirm');
	if (!payload) {
		return { success: false as const, message: 'Link invalid sau expirat.' };
	}

	const existing = await db
		.select()
		.from(subscribers)
		.where(eq(subscribers.id, payload.sub))
		.limit(1);

	if (existing.length === 0) {
		return { success: false as const, message: 'Contul nu a fost găsit.' };
	}

	const sub = existing[0];

	if (sub.status === 'unsubscribed') {
		return { success: false as const, message: 'Ești dezabonat de la comunicările noastre.' };
	}

	if (sub.status === 'confirmed') {
		return { success: true as const, alreadyConfirmed: true };
	}

	await db
		.update(subscribers)
		.set({ status: 'confirmed', confirmed_at: new Date() })
		.where(eq(subscribers.id, payload.sub));

	return { success: true as const, alreadyConfirmed: false };
}
