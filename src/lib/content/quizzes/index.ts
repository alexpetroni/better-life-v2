import type { QuizDefinition } from '$lib/quiz/types.js';
import { somnQuiz } from './somn.js';
import { obiceiuriQuiz } from './obiceiuri.js';

export const quizzes: Record<string, QuizDefinition> = {
	somn: somnQuiz,
	obiceiuri: obiceiuriQuiz
};

export const allQuizzes: QuizDefinition[] = Object.values(quizzes);

export function getQuiz(slug: string): QuizDefinition | undefined {
	return quizzes[slug];
}

export function getQuizzes(): QuizDefinition[] {
	return allQuizzes;
}
