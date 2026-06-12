import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export function requireCronAuth(request: Request): void {
	const auth = request.headers.get('Authorization');
	const expected = `Bearer ${env.CRON_SECRET}`;
	if (auth !== expected) {
		throw error(401, 'Unauthorized');
	}
}
