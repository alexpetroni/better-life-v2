import { describe, expect, it } from 'vitest';
import { getTopic, topics } from './topics.js';

describe('topics registry', () => {
	it('returns all topics', () => {
		expect(topics.length).toBeGreaterThan(0);
	});

	it('getTopic returns somn topic', () => {
		const topic = getTopic('somn');
		expect(topic).toBeDefined();
		expect(topic?.slug).toBe('somn');
		expect(topic?.quizSlug).toBe('somn');
	});

	it('getTopic returns undefined for unknown slug', () => {
		expect(getTopic('unknown')).toBeUndefined();
	});

	it('all topics have required fields', () => {
		for (const topic of topics) {
			expect(topic.slug).toBeTruthy();
			expect(topic.name).toBeTruthy();
			expect(topic.emoji).toBeTruthy();
			expect(topic.tagline).toBeTruthy();
		}
	});
});
