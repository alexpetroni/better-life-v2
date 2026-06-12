import { describe, expect, it } from 'vitest';
import { somnQuiz } from '$lib/content/quizzes/somn.js';
import { scoreQuiz } from './score.js';

function answersFor(q1: string, q2: string, q3: string, q4: string, q5: string, q6: string, q7: string, q8: string) {
	return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

// Night owl (max cronotip): q1d, q2d, q3d, q4d
// Morning bird (min cronotip): q1a, q2a, q3a, q4a
// Good hygiene (max igiena): q5a, q6a, q7a, q8a
// Bad hygiene (min igiena): q5d, q6d, q7d, q8d

const nightOwlBadHygiene = answersFor('q1d', 'q2d', 'q3d', 'q4d', 'q5d', 'q6d', 'q7d', 'q8d');
const nightOwlGoodHygiene = answersFor('q1d', 'q2d', 'q3d', 'q4d', 'q5a', 'q6a', 'q7a', 'q8a');
const morningBadHygiene = answersFor('q1a', 'q2a', 'q3a', 'q4a', 'q5d', 'q6d', 'q7d', 'q8d');
const morningGoodHygiene = answersFor('q1a', 'q2a', 'q3a', 'q4a', 'q5a', 'q6a', 'q7a', 'q8a');

describe('scoreQuiz - somn quiz', () => {
	it('reaches bufnita-dezorganizata (night owl + bad hygiene)', () => {
		const { profile, scores } = scoreQuiz(somnQuiz, nightOwlBadHygiene);
		expect(profile.key).toBe('bufnita-dezorganizata');
		expect(scores.cronotip).toBe(12);
		expect(scores.igiena).toBe(0);
	});

	it('reaches bufnita-disciplinata (night owl + good hygiene)', () => {
		const { profile, scores } = scoreQuiz(somnQuiz, nightOwlGoodHygiene);
		expect(profile.key).toBe('bufnita-disciplinata');
		expect(scores.cronotip).toBe(12);
		expect(scores.igiena).toBe(12);
	});

	it('reaches matinal-suprasolicitat (morning person + bad hygiene)', () => {
		const { profile, scores } = scoreQuiz(somnQuiz, morningBadHygiene);
		expect(profile.key).toBe('matinal-suprasolicitat');
		expect(scores.cronotip).toBe(0);
		expect(scores.igiena).toBe(0);
	});

	it('reaches dormitor-echilibrat (catch-all for morning + good hygiene)', () => {
		const { profile } = scoreQuiz(somnQuiz, morningGoodHygiene);
		expect(profile.key).toBe('dormitor-echilibrat');
		expect(profile.match).toEqual({});
	});

	it('catch-all fires when nothing else matches', () => {
		// Mid scores that don't fit any specific profile
		const midAnswers = answersFor('q1b', 'q2b', 'q3b', 'q4b', 'q5a', 'q6a', 'q7a', 'q8a');
		const { profile } = scoreQuiz(somnQuiz, midAnswers);
		// Mid cronotip (4) + good hygiene → dormitor-echilibrat
		expect(profile.key).toBe('dormitor-echilibrat');
	});

	it('throws on invalid option id', () => {
		const badAnswers = { ...nightOwlBadHygiene, q1: 'invalid-option' };
		expect(() => scoreQuiz(somnQuiz, badAnswers)).toThrow('Unknown option');
	});

	it('throws on missing answer', () => {
		const incomplete = { q1: 'q1a', q2: 'q2a', q3: 'q3a', q4: 'q4a', q5: 'q5a', q6: 'q6a', q7: 'q7a' };
		expect(() => scoreQuiz(somnQuiz, incomplete)).toThrow('Missing answer');
	});

	it('first-match-wins: bufnita-dezorganizata wins over later profiles', () => {
		// High cronotip + borderline igiena=5 → should match bufnita-dezorganizata (not bufnita-disciplinata)
		const borderlineAnswers = answersFor('q1d', 'q2d', 'q3d', 'q4d', 'q5b', 'q6b', 'q7b', 'q8d');
		// igiena: 2+2+2+0 = 6... let me recalculate
		// q5b=2, q6b=2, q7b=2, q8d=0 → igiena=6 → that's bufnita-disciplinata
		// Use: q5d=0, q6d=0, q7d=0, q8b=2 → igiena=2 → bufnita-dezorganizata
		const confirmedBufnitaDez = answersFor('q1d', 'q2d', 'q3d', 'q4c', 'q5d', 'q6d', 'q7d', 'q8b');
		// cronotip: 3+3+3+2=11≥7, igiena: 0+0+0+2=2≤5 → bufnita-dezorganizata
		const { profile } = scoreQuiz(somnQuiz, confirmedBufnitaDez);
		expect(profile.key).toBe('bufnita-dezorganizata');
	});
});
