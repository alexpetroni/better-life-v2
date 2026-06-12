import { describe, expect, it } from 'vitest';
import { somnQuiz } from '$lib/content/quizzes/somn.js';
import { obiceiuriQuiz } from '$lib/content/quizzes/obiceiuri.js';
import { allQuizzes } from '$lib/content/quizzes/index.js';
import { sequences } from '$lib/server/email/sequences.js';
import { scoreQuiz } from './score.js';

const SEED_PRODUCT_SLUGS = ['masca-somn', 'ghid-seara-linistita', 'jurnal-obiceiuri', 'curs-obiceiuri-mici'];

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

function obiceiuriAnswers(q1: string, q2: string, q3: string, q4: string, q5: string, q6: string, q7: string, q8: string) {
	return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

describe('scoreQuiz - obiceiuri quiz', () => {
	// constructor-constant: consecventa≥7, mediu≥7
	it('reaches constructor-constant (high consecventa + high mediu)', () => {
		// All 'a' options → consecventa=12, mediu=12
		const answers = obiceiuriAnswers('q1a', 'q2a', 'q3a', 'q4a', 'q5a', 'q6a', 'q7a', 'q8a');
		const { profile, scores } = scoreQuiz(obiceiuriQuiz, answers);
		expect(profile.key).toBe('constructor-constant');
		expect(scores.consecventa).toBe(12);
		expect(scores.mediu).toBe(12);
	});

	// perfectionist-blocat: consecventa≤6, mediu≥7
	it('reaches perfectionist-blocat (low consecventa + high mediu)', () => {
		// consecventa: q1d(0)+q2d(0)+q3d(0)+q4c(0)=0; mediu: q5a(3)+q6a(3)+q7a(3)+q8a(3)=12
		const answers = obiceiuriAnswers('q1d', 'q2d', 'q3d', 'q4c', 'q5a', 'q6a', 'q7a', 'q8a');
		const { profile, scores } = scoreQuiz(obiceiuriQuiz, answers);
		expect(profile.key).toBe('perfectionist-blocat');
		expect(scores.consecventa).toBe(0);
		expect(scores.mediu).toBe(12);
	});

	// incepator-entuziast: consecventa≥7, mediu≤6
	it('reaches incepator-entuziast (high consecventa + low mediu)', () => {
		// consecventa: q1a(3)+q2a(3)+q3a(3)+q4a(3)=12; mediu: all d=0
		const answers = obiceiuriAnswers('q1a', 'q2a', 'q3a', 'q4a', 'q5d', 'q6d', 'q7d', 'q8d');
		const { profile, scores } = scoreQuiz(obiceiuriQuiz, answers);
		expect(profile.key).toBe('incepator-entuziast');
		expect(scores.consecventa).toBe(12);
		expect(scores.mediu).toBe(0);
	});

	// explorator: catch-all (low consecventa + low mediu)
	it('reaches explorator catch-all (low consecventa + low mediu)', () => {
		const answers = obiceiuriAnswers('q1d', 'q2d', 'q3d', 'q4d', 'q5d', 'q6d', 'q7d', 'q8d');
		const { profile } = scoreQuiz(obiceiuriQuiz, answers);
		expect(profile.key).toBe('explorator');
		expect(profile.match).toEqual({});
	});
});

describe('quiz engine invariants', () => {
	it('every quiz has a catch-all as last profile', () => {
		for (const quiz of allQuizzes) {
			const last = quiz.profiles[quiz.profiles.length - 1];
			expect(Object.keys(last.match).length).toBe(0);
		}
	});

	it('every quiz profile sequenceKey exists in sequences', () => {
		for (const quiz of allQuizzes) {
			for (const profile of quiz.profiles) {
				expect(sequences[profile.sequenceKey]).toBeDefined();
			}
		}
	});

	it('every quiz profile recommendedProductSlug exists in seed slugs', () => {
		for (const quiz of allQuizzes) {
			for (const profile of quiz.profiles) {
				for (const slug of profile.recommendedProductSlugs) {
					expect(SEED_PRODUCT_SLUGS).toContain(slug);
				}
			}
		}
	});
});
