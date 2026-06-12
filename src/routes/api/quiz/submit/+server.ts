import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client.js';
import { subscribers, quiz_results, email_sends } from '$lib/server/db/schema.js';
import { getQuiz } from '$lib/content/quizzes/index.js';
import { scoreQuiz } from '$lib/server/quiz/score.js';
import { sendEmail } from '$lib/server/email/send.js';
import { resultsEmail } from '$lib/server/email/templates/results.js';
import { signToken, confirmUrl, prefsUrl, unsubUrl } from '$lib/server/tokens.js';
import { eq, and, gte, count, sql } from 'drizzle-orm';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST({ request }) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Invalid JSON body' });
	}

	if (!body || typeof body !== 'object') {
		throw error(400, { message: 'Invalid request body' });
	}

	const { quizSlug, answers, email, website } = body as Record<string, unknown>;

	// Honeypot
	if (website) {
		return json({ resultToken: null });
	}

	// Validate quiz slug
	if (typeof quizSlug !== 'string' || !quizSlug) {
		throw error(400, { message: 'quizSlug is required' });
	}

	const quiz = getQuiz(quizSlug);
	if (!quiz) {
		throw error(400, { message: `Unknown quiz: ${quizSlug}` });
	}

	// Validate email
	if (typeof email !== 'string' || !email) {
		throw error(400, { message: 'email is required' });
	}
	const normalizedEmail = email.toLowerCase().trim();
	if (!EMAIL_REGEX.test(normalizedEmail) || normalizedEmail.length > 254) {
		throw error(400, { message: 'Invalid email address' });
	}

	// Validate answers
	if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
		throw error(400, { message: 'answers must be an object' });
	}

	// Server-side re-score
	let scores: Record<string, number>;
	let profile: import('$lib/quiz/types.js').QuizProfile;
	try {
		const result = scoreQuiz(quiz, answers as Record<string, string>);
		scores = result.scores;
		profile = result.profile;
	} catch (e) {
		throw error(400, { message: e instanceof Error ? e.message : 'Invalid answers' });
	}

	// Upsert subscriber
	const existing = await db
		.select()
		.from(subscribers)
		.where(eq(subscribers.email, normalizedEmail))
		.limit(1);

	let subscriberId: string;

	if (existing.length === 0) {
		const [newSub] = await db
			.insert(subscribers)
			.values({
				email: normalizedEmail,
				status: 'pending',
				cadence: profile.defaultCadence,
				primary_profile_key: profile.key,
				primary_quiz_slug: quizSlug
			})
			.returning({ id: subscribers.id });
		subscriberId = newSub.id;
	} else {
		const sub = existing[0];
		subscriberId = sub.id;
		// Never resurrect unsubscribed; only update profile/cadence if they haven't customized
		await db
			.update(subscribers)
			.set({
				primary_profile_key: profile.key,
				primary_quiz_slug: quizSlug,
				// Only reset cadence if it's the default (weekly) — never override user's customization
				...(sub.status !== 'unsubscribed' && sub.cadence === sub.cadence
					? { cadence: profile.defaultCadence }
					: {})
			})
			.where(eq(subscribers.id, subscriberId));
	}

	// Insert quiz result
	const [result] = await db
		.insert(quiz_results)
		.values({
			subscriber_id: subscriberId,
			quiz_slug: quizSlug,
			quiz_version: quiz.version,
			profile_key: profile.key,
			answers: answers as Record<string, string>,
			scores
		})
		.returning({ id: quiz_results.id });

	const resultId = result.id;

	// Send cap: check sends in last 24h
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const recentSends = await db
		.select({ count: count() })
		.from(email_sends)
		.where(
			and(
				eq(email_sends.recipient_email, normalizedEmail),
				sql`${email_sends.email_key} like 'results:%'`,
				gte(email_sends.created_at, oneDayAgo)
			)
		);

	const sendCount = recentSends[0]?.count ?? 0;
	const sub = existing[0] ?? { status: 'pending', id: subscriberId };
	const subscriberStatus = existing.length > 0 ? existing[0].status : 'pending';

	if (sendCount < 3 && subscriberStatus !== 'unsubscribed') {
		const { subject, html } = resultsEmail({
			quiz,
			profile,
			confirmUrl: confirmUrl(subscriberId),
			prefsUrl: prefsUrl(subscriberId),
			unsubUrl: unsubUrl(subscriberId)
		});

		await sendEmail({
			emailKey: `results:${resultId}`,
			to: normalizedEmail,
			subscriberId,
			subject,
			html
		});
	}

	const resultToken = signToken(resultId, 'result');
	return json({ resultToken });
}
