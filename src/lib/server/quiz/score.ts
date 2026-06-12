import type { QuizDefinition, QuizProfile } from '$lib/quiz/types.js';

export function scoreQuiz(
	quiz: QuizDefinition,
	answers: Record<string, string>
): { scores: Record<string, number>; profile: QuizProfile } {
	const scores: Record<string, number> = {};
	for (const dim of quiz.dimensions) {
		scores[dim] = 0;
	}

	for (const question of quiz.questions) {
		const answerId = answers[question.id];
		if (!answerId) {
			throw new Error(`Missing answer for question ${question.id}`);
		}
		const option = question.options.find((o) => o.id === answerId);
		if (!option) {
			throw new Error(`Unknown option "${answerId}" for question "${question.id}"`);
		}
		for (const [dim, weight] of Object.entries(option.weights)) {
			scores[dim] = (scores[dim] ?? 0) + weight;
		}
	}

	for (const profile of quiz.profiles) {
		let matches = true;
		for (const [dim, constraint] of Object.entries(profile.match)) {
			if (!constraint) continue;
			const score = scores[dim] ?? 0;
			if (constraint.min !== undefined && score < constraint.min) {
				matches = false;
				break;
			}
			if (constraint.max !== undefined && score > constraint.max) {
				matches = false;
				break;
			}
		}
		if (matches) {
			return { scores, profile };
		}
	}

	throw new Error('No profile matched — last profile must have match: {}');
}
