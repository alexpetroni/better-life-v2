import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { signToken, verifyToken } from './tokens.js';

describe('tokens', () => {
	it('round-trips a valid token', () => {
		const token = signToken('user-123', 'confirm');
		const payload = verifyToken(token, 'confirm');
		expect(payload).not.toBeNull();
		expect(payload?.sub).toBe('user-123');
		expect(payload?.p).toBe('confirm');
	});

	it('rejects tampered payload', () => {
		const token = signToken('user-123', 'confirm');
		const dotIdx = token.lastIndexOf('.');
		const payloadB64 = token.slice(0, dotIdx);
		const sig = token.slice(dotIdx + 1);
		const chars = payloadB64.split('');
		chars[chars.length - 1] = chars[chars.length - 1] === 'A' ? 'B' : 'A';
		const tampered = chars.join('');
		expect(verifyToken(`${tampered}.${sig}`, 'confirm')).toBeNull();
	});

	it('rejects wrong purpose', () => {
		const token = signToken('user-123', 'confirm');
		expect(verifyToken(token, 'prefs')).toBeNull();
	});

	it('rejects expired token', () => {
		const secret = process.env.EMAIL_TOKEN_SECRET ?? 'dev-secret-change-me-32-bytes-min';
		const payload = { sub: 'user-123', p: 'confirm', exp: 1 };
		const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
		const sig = createHmac('sha256', secret).update(payloadB64).digest().toString('base64url');
		expect(verifyToken(`${payloadB64}.${sig}`, 'confirm')).toBeNull();
	});

	it('rejects malformed token', () => {
		expect(verifyToken('not-a-token', 'confirm')).toBeNull();
		expect(verifyToken('', 'confirm')).toBeNull();
		expect(verifyToken('AAAA.BBBB', 'confirm')).toBeNull();
	});
});
