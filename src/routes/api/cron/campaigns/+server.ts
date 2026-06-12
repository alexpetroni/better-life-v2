import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client.js';
import { subscribers, quiz_results, email_sends } from '$lib/server/db/schema.js';
import { requireCronAuth } from '$lib/server/cron.js';
import { campaigns } from '$lib/server/email/campaigns.js';
import { sendEmail, marketingHeaders } from '$lib/server/email/send.js';
import { prefsUrl, unsubUrl } from '$lib/server/tokens.js';
import { maxOffsetDays } from '$lib/server/email/sequences.js';
import { isCadenceDue, isOutOfDripWindow } from '$lib/server/email/campaign-predicates.js';
import { getQuiz } from '$lib/content/quizzes/index.js';
import { eq, and, isNotNull, max, like, gt, sql } from 'drizzle-orm';

export async function GET({ request }) {
	requireCronAuth(request);

	const today = new Date().toISOString().slice(0, 10);
	const now = new Date();

	const activeCampaigns = campaigns.filter((c) => c.activeFrom <= today);

	const results: Record<string, { sent: number; skipped: number; failed: number }> = {};

	// Track which subscriber IDs have been sent a campaign this run (at most one per run)
	const sentThisRun = new Set<string>();

	// Last send time of ANY campaign per recipient — the cadence window spans all
	// campaigns: a weekly subscriber gets at most one campaign email per window,
	// not one per campaign
	const lastSends = await db
		.select({
			recipient_email: email_sends.recipient_email,
			sent_at: max(email_sends.sent_at)
		})
		.from(email_sends)
		.where(like(email_sends.email_key, 'campaign:%'))
		.groupBy(email_sends.recipient_email);

	const lastSendMap = new Map(lastSends.map((s) => [s.recipient_email, s.sent_at]));

	for (const campaign of activeCampaigns) {
		results[campaign.id] = { sent: 0, skipped: 0, failed: 0 };

		// Build audience filter
		const profileKeyFilter =
			campaign.audience === 'all'
				? null
				: (campaign.audience as { profileKeys: string[] }).profileKeys;

		// Select confirmed subscribers with their latest quiz result date
		const confirmedSubs = await db
			.select({
				id: subscribers.id,
				email: subscribers.email,
				confirmed_at: subscribers.confirmed_at,
				cadence: subscribers.cadence,
				primary_profile_key: subscribers.primary_profile_key,
				primary_quiz_slug: subscribers.primary_quiz_slug,
				latest_result_at: max(quiz_results.created_at)
			})
			.from(subscribers)
			.leftJoin(quiz_results, eq(quiz_results.subscriber_id, subscribers.id))
			.where(
				and(
					eq(subscribers.status, 'confirmed'),
					isNotNull(subscribers.confirmed_at)
				)
			)
			.groupBy(
				subscribers.id,
				subscribers.email,
				subscribers.confirmed_at,
				subscribers.cadence,
				subscribers.primary_profile_key,
				subscribers.primary_quiz_slug
			);

		const campaignKey = `campaign:${campaign.id}`;

		for (const sub of confirmedSubs) {
			if (sentThisRun.has(sub.id)) {
				results[campaign.id].skipped++;
				continue;
			}

			// Audience filter
			if (profileKeyFilter && !profileKeyFilter.includes(sub.primary_profile_key ?? '')) {
				results[campaign.id].skipped++;
				continue;
			}

			// Cadence filter
			const lastSentAt = lastSendMap.get(sub.email) ?? null;
			if (!isCadenceDue(sub.cadence, lastSentAt, now)) {
				results[campaign.id].skipped++;
				continue;
			}

			// Drip window filter — skip if subscriber is still in drip window
			const quiz = sub.primary_quiz_slug ? getQuiz(sub.primary_quiz_slug) : null;
			const profile = quiz?.profiles.find((p) => p.key === sub.primary_profile_key);
			const sequenceKey = profile?.sequenceKey;
			const maxOffset = sequenceKey ? maxOffsetDays(sequenceKey) : 0;

			const anchor = sub.latest_result_at && sub.confirmed_at
				? new Date(Math.max(new Date(sub.confirmed_at).getTime(), new Date(sub.latest_result_at).getTime()))
				: sub.confirmed_at ? new Date(sub.confirmed_at) : null;

			if (anchor && !isOutOfDripWindow(anchor, maxOffset, now)) {
				results[campaign.id].skipped++;
				continue;
			}

			// Send
			const subPrefsUrl = prefsUrl(sub.id);
			const subUnsubUrl = unsubUrl(sub.id);

			const html = campaign.bodyHtml({ prefsUrl: subPrefsUrl, unsubUrl: subUnsubUrl });

			const result = await sendEmail({
				emailKey: campaignKey,
				to: sub.email,
				subscriberId: sub.id,
				subject: campaign.subject,
				html,
				headers: marketingHeaders(subUnsubUrl)
			});

			if (result === 'sent') {
				results[campaign.id].sent++;
				sentThisRun.add(sub.id);
			} else if (result === 'skipped') {
				results[campaign.id].skipped++;
			} else {
				results[campaign.id].failed++;
			}
		}
	}

	return json({ campaigns: results });
}
