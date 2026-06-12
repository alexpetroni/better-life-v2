import { db } from '$lib/server/db/client.js';
import { quiz_results } from '$lib/server/db/schema.js';
import { getQuiz } from '$lib/content/quizzes/index.js';
import { verifyToken } from '$lib/server/tokens.js';
import { eq } from 'drizzle-orm';

export const prerender = false;

export async function load({ url }) {
	const token = url.searchParams.get('t');
	if (!token) {
		return { valid: false as const, quiz: null, profile: null, result: null };
	}

	const payload = verifyToken(token, 'result');
	if (!payload) {
		return { valid: false as const, quiz: null, profile: null, result: null };
	}

	const results = await db
		.select()
		.from(quiz_results)
		.where(eq(quiz_results.id, payload.sub))
		.limit(1);

	if (results.length === 0) {
		return { valid: false as const, quiz: null, profile: null, result: null };
	}

	const result = results[0];
	const quiz = getQuiz(result.quiz_slug);
	if (!quiz) {
		return { valid: false as const, quiz: null, profile: null, result: null };
	}

	// Resolve profile by stored profile_key (fall back if version mismatch)
	const profile = quiz.profiles.find((p) => p.key === result.profile_key) ?? quiz.profiles[quiz.profiles.length - 1];

	return { valid: true as const, quiz, profile, result };
}
