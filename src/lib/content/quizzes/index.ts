import type { QuizDefinition } from '$lib/quiz/types.js';
import { somnQuiz } from './somn.js';

export const quizzes: Record<string, QuizDefinition> = {
	somn: somnQuiz
};

export const allQuizzes: QuizDefinition[] = Object.values(quizzes);

export function getQuiz(slug: string): QuizDefinition | undefined {
	return quizzes[slug];
}
