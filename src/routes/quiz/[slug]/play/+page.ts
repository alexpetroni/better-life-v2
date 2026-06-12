import { getQuiz } from '$lib/content/quizzes/index.js';
import { error } from '@sveltejs/kit';

export const csr = true;
export const prerender = false;

export async function load({ params }) {
	const quiz = getQuiz(params.slug);
	if (!quiz) {
		throw error(404, 'Test negăsit');
	}
	return { quiz };
}
