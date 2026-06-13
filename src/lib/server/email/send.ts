import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/client.js';
import { email_sends } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';

interface SendEmailParams {
	emailKey: string;
	to: string;
	subscriberId?: string;
	subject: string;
	html: string;
	headers?: Record<string, string>;
}

export async function sendEmail(params: SendEmailParams): Promise<'sent' | 'skipped' | 'failed'> {
	const { emailKey, to, subscriberId, subject, html, headers } = params;

	try {
		await db.insert(email_sends).values({
			email_key: emailKey,
			recipient_email: to.toLowerCase().trim(),
			subscriber_id: subscriberId ?? null,
			status: 'pending'
		});
	} catch {
		return 'skipped';
	}

	const isDryRun = env.EMAIL_DRYRUN === '1' || !env.RESEND_API_KEY;

	if (isDryRun) {
		console.log(`[email dry-run] ${emailKey} → ${to}: ${subject}`);
		await db
			.update(email_sends)
			.set({ status: 'sent', resend_id: 'dry-run', sent_at: new Date() })
			.where(
				and(
					eq(email_sends.recipient_email, to.toLowerCase().trim()),
					eq(email_sends.email_key, emailKey)
				)
			);
		return 'sent';
	}

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
				...headers
			},
			body: JSON.stringify({
				from: env.EMAIL_FROM ?? 'Better Life <salut@viatamaibuna.example>',
				to: [to],
				subject,
				html
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			await db
				.update(email_sends)
				.set({ status: 'failed', error: errorText })
				.where(
					and(
						eq(email_sends.recipient_email, to.toLowerCase().trim()),
						eq(email_sends.email_key, emailKey)
					)
				);
			return 'failed';
		}

		const data = (await response.json()) as { id: string };
		await db
			.update(email_sends)
			.set({ status: 'sent', resend_id: data.id, sent_at: new Date() })
			.where(
				and(
					eq(email_sends.recipient_email, to.toLowerCase().trim()),
					eq(email_sends.email_key, emailKey)
				)
			);
		return 'sent';
	} catch (err) {
		const error = err instanceof Error ? err.message : String(err);
		await db
			.update(email_sends)
			.set({ status: 'failed', error })
			.where(
				and(
					eq(email_sends.recipient_email, to.toLowerCase().trim()),
					eq(email_sends.email_key, emailKey)
				)
			);
		return 'failed';
	}
}

export const marketingHeaders = (unsubUrl: string) => ({
	'List-Unsubscribe': `<mailto:unsubscribe@viatamaibuna.example>, <${unsubUrl}>`,
	'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
});
