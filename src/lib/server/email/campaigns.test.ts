import { describe, expect, it } from 'vitest';
import { isCadenceDue, isOutOfDripWindow } from './campaign-predicates.js';

const NOW = new Date('2026-06-12T10:00:00Z');

describe('isCadenceDue', () => {
	it('returns true when no previous campaign was sent', () => {
		expect(isCadenceDue('weekly', null, NOW)).toBe(true);
		expect(isCadenceDue('monthly', null, NOW)).toBe(true);
	});

	it('returns false for cadence=none', () => {
		expect(isCadenceDue('none', null, NOW)).toBe(false);
		expect(isCadenceDue('none', new Date('2026-01-01'), NOW)).toBe(false);
	});

	it('returns false for weekly when last sent < 6 days ago', () => {
		const lastSent = new Date(NOW.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
		expect(isCadenceDue('weekly', lastSent, NOW)).toBe(false);
	});

	it('returns true for weekly when last sent >= 6 days ago', () => {
		const lastSent = new Date(NOW.getTime() - 6 * 24 * 60 * 60 * 1000); // exactly 6 days
		expect(isCadenceDue('weekly', lastSent, NOW)).toBe(true);
	});

	it('returns false for monthly when last sent < 27 days ago', () => {
		const lastSent = new Date(NOW.getTime() - 26 * 24 * 60 * 60 * 1000);
		expect(isCadenceDue('monthly', lastSent, NOW)).toBe(false);
	});

	it('returns true for monthly when last sent >= 27 days ago', () => {
		const lastSent = new Date(NOW.getTime() - 27 * 24 * 60 * 60 * 1000);
		expect(isCadenceDue('monthly', lastSent, NOW)).toBe(true);
	});
});

describe('isOutOfDripWindow', () => {
	it('returns false when inside drip window', () => {
		// confirmed 5 days ago, drip maxOffset = 14 → window ends at day 15
		const confirmedAt = new Date(NOW.getTime() - 5 * 24 * 60 * 60 * 1000);
		expect(isOutOfDripWindow(confirmedAt, 14, NOW)).toBe(false);
	});

	it('returns true when past drip window', () => {
		// confirmed 20 days ago, maxOffset = 14 → window ends at day 15 → we are at day 20
		const confirmedAt = new Date(NOW.getTime() - 20 * 24 * 60 * 60 * 1000);
		expect(isOutOfDripWindow(confirmedAt, 14, NOW)).toBe(true);
	});

	it('returns true immediately after window closes (day maxOffset+1)', () => {
		// confirmed exactly 15 days ago, maxOffset=14 → just past window end
		const confirmedAt = new Date(NOW.getTime() - 15 * 24 * 60 * 60 * 1000 - 1);
		expect(isOutOfDripWindow(confirmedAt, 14, NOW)).toBe(true);
	});

	it('returns false exactly at window boundary', () => {
		// confirmed exactly 15 days ago to the ms — inside window end (window = confirmedAt + 15 days)
		const confirmedAt = new Date(NOW.getTime() - 15 * 24 * 60 * 60 * 1000);
		// windowEnd = confirmedAt + 15*day = NOW exactly — NOT strictly greater
		expect(isOutOfDripWindow(confirmedAt, 14, NOW)).toBe(false);
	});
});
