// Pure predicate functions for campaign eligibility — exported for testing

export function isCadenceDue(
	cadence: string,
	lastCampaignSentAt: Date | null,
	now: Date
): boolean {
	if (cadence === 'none') return false;
	if (!lastCampaignSentAt) return true;

	const msElapsed = now.getTime() - lastCampaignSentAt.getTime();
	if (cadence === 'weekly') {
		return msElapsed >= 6 * 24 * 60 * 60 * 1000; // 6 days
	}
	if (cadence === 'monthly') {
		return msElapsed >= 27 * 24 * 60 * 60 * 1000; // 27 days
	}
	return false;
}

export function isOutOfDripWindow(
	confirmedAt: Date,
	maxDripOffsetDays: number,
	now: Date
): boolean {
	const windowEndMs = confirmedAt.getTime() + (maxDripOffsetDays + 1) * 24 * 60 * 60 * 1000;
	return now.getTime() > windowEndMs;
}
