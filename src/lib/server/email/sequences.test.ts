import { describe, expect, it } from 'vitest';
import { sequences, maxOffsetDays } from './sequences.js';
import type { SequenceCtx } from './sequences.js';
import { somnQuiz } from '$lib/content/quizzes/somn.js';

const mockCtx: SequenceCtx = {
	profile: somnQuiz.profiles[0],
	prefsUrl: 'https://example.com/prefs/token',
	unsubUrl: 'https://example.com/unsub/token'
};

describe('sequences', () => {
	it('somn-v1 has 5 steps', () => {
		expect(sequences['somn-v1']).toHaveLength(5);
	});

	it('step numbers are unique', () => {
		const steps = sequences['somn-v1'].map((s) => s.step);
		const unique = new Set(steps);
		expect(unique.size).toBe(steps.length);
	});

	it('dayOffsets are strictly increasing', () => {
		const offsets = sequences['somn-v1'].map((s) => s.dayOffset);
		for (let i = 1; i < offsets.length; i++) {
			expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
		}
	});

	it('every step bodyHtml renders non-empty HTML containing unsubscribe URL', () => {
		for (const step of sequences['somn-v1']) {
			const html = step.bodyHtml(mockCtx);
			expect(html.length).toBeGreaterThan(100);
			expect(html).toContain(mockCtx.unsubUrl);
		}
	});

	it('maxOffsetDays returns largest dayOffset', () => {
		expect(maxOffsetDays('somn-v1')).toBe(14);
	});

	it('maxOffsetDays returns 0 for unknown sequence', () => {
		expect(maxOffsetDays('unknown-sequence')).toBe(0);
	});
});
