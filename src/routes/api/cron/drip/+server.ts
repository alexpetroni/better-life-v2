import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client.js';
import { subscribers, quiz_results } from '$lib/server/db/schema.js';
import { requireCronAuth } from '$lib/server/cron.js';
import { sequences } from '$lib/server/email/sequences.js';
import { sendEmail, marketingHeaders } from '$lib/server/email/send.js';
import { prefsUrl, unsubUrl } from '$lib/server/tokens.js';
import { getQuiz } from '$lib/content/quizzes/index.js';
import { eq, and, isNotNull, max, sql } from 'drizzle-orm';

export async function GET({ request }) {
	requireCronAuth(request);

	const confirmedSubs = await db
		.select({
			id: subscribers.id,
			email: subscribers.email,
			confirmed_at: subscribers.confirmed_at,
			primary_profile_key: subscribers.primary_profile_key,
			primary_quiz_slug: subscribers.primary_quiz_slug,
			latest_result_at: max(quiz_results.created_at)
		})
		.from(subscribers)
		.leftJoin(quiz_results, eq(quiz_results.subscriber_id, subscribers.id))
		.where(
			and(
				eq(subscribers.status, 'confirmed'),
				isNotNull(subscribers.confirmed_at),
				isNotNull(subscribers.primary_profile_key)
			)
		)
		.groupBy(
			subscribers.id,
			subscribers.email,
			subscribers.confirmed_at,
			subscribers.primary_profile_key,
			subscribers.primary_quiz_slug
		);

	let processed = 0;
	let sent = 0;
	let skipped = 0;
	let failed = 0;

	for (const sub of confirmedSubs) {
		if (!sub.primary_quiz_slug || !sub.primary_profile_key) continue;

		const quiz = getQuiz(sub.primary_quiz_slug);
		if (!quiz) continue;

		const profile = quiz.profiles.find((p) => p.key === sub.primary_profile_key);
		if (!profile) continue;

		const sequenceKey = profile.sequenceKey;
		const sequence = sequences[sequenceKey];
		if (!sequence) continue;

		processed++;

		// Anchor date: GREATEST(confirmed_at, latest quiz result)
		const anchor = sub.latest_result_at && sub.confirmed_at
			? new Date(Math.max(new Date(sub.confirmed_at).getTime(), new Date(sub.latest_result_at).getTime()))
			: new Date(sub.confirmed_at!);

		const now = Date.now();

		for (const step of sequence) {
			const dueAt = anchor.getTime() + step.dayOffset * 24 * 60 * 60 * 1000;
			if (dueAt > now) continue;

			const emailKey = `seq:${sequenceKey}:${step.step}`;
			const subPrefsUrl = prefsUrl(sub.id);
			const subUnsubUrl = unsubUrl(sub.id);

			const html = step.bodyHtml({
				profile,
				prefsUrl: subPrefsUrl,
				unsubUrl: subUnsubUrl
			});

			const result = await sendEmail({
				emailKey,
				to: sub.email,
				subscriberId: sub.id,
				subject: step.subject,
				html,
				headers: marketingHeaders(subUnsubUrl)
			});

			if (result === 'sent') sent++;
			else if (result === 'skipped') skipped++;
			else failed++;
		}
	}

	return json({ processed, sent, skipped, failed });
}
