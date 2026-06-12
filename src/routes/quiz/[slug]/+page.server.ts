import { getQuiz, allQuizzes } from '$lib/content/quizzes/index.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
	return allQuizzes.map((q) => ({ slug: q.slug }));
}

export async function load({ params }) {
	const quiz = getQuiz(params.slug);
	if (!quiz) {
		throw error(404, 'Test negăsit');
	}
	return { quiz };
}
