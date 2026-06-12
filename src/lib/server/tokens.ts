import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';

type Purpose = 'confirm' | 'prefs' | 'unsub' | 'result';

interface TokenPayload {
	sub: string;
	p: Purpose;
	exp: number;
}

const EXPIRY: Record<Purpose, number> = {
	confirm: 30 * 24 * 60 * 60,
	prefs: 365 * 24 * 60 * 60,
	unsub: 365 * 24 * 60 * 60,
	result: 7 * 24 * 60 * 60
};

function b64url(buf: Buffer | string): string {
	const b = typeof buf === 'string' ? Buffer.from(buf) : buf;
	return b.toString('base64url');
}

export function signToken(sub: string, purpose: Purpose): string {
	const exp = Math.floor(Date.now() / 1000) + EXPIRY[purpose];
	const payload: TokenPayload = { sub, p: purpose, exp };
	const payloadB64 = b64url(JSON.stringify(payload));
	const sig = createHmac('sha256', env.EMAIL_TOKEN_SECRET)
		.update(payloadB64)
		.digest();
	return `${payloadB64}.${b64url(sig)}`;
}

export function verifyToken(token: string, expectedPurpose: Purpose): TokenPayload | null {
	try {
		const dotIdx = token.lastIndexOf('.');
		if (dotIdx === -1) return null;

		const payloadB64 = token.slice(0, dotIdx);
		const sigB64 = token.slice(dotIdx + 1);

		const expectedSig = createHmac('sha256', env.EMAIL_TOKEN_SECRET)
			.update(payloadB64)
			.digest();

		const actualSig = Buffer.from(sigB64, 'base64url');
		if (actualSig.length !== expectedSig.length) return null;

		const valid = timingSafeEqual(actualSig, expectedSig);
		if (!valid) return null;

		const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
		if (payload.p !== expectedPurpose) return null;
		if (payload.exp < Math.floor(Date.now() / 1000)) return null;

		return payload;
	} catch {
		return null;
	}
}

function siteUrl(): string {
	return (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
}

export function confirmUrl(subscriberId: string): string {
	return `${siteUrl()}/email/confirm/${signToken(subscriberId, 'confirm')}`;
}

export function prefsUrl(subscriberId: string): string {
	return `${siteUrl()}/email/preferences/${signToken(subscriberId, 'prefs')}`;
}

export function unsubUrl(subscriberId: string): string {
	return `${siteUrl()}/email/unsubscribe/${signToken(subscriberId, 'unsub')}`;
}

export function resultUrl(resultId: string): string {
	return `${siteUrl()}/quiz/somn/results?t=${signToken(resultId, 'result')}`;
}
