import { getTopic } from '$lib/content/topics.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const topic = getTopic(params.topic);
	if (!topic) {
		throw error(404, 'Domeniu negăsit');
	}
	return { topic };
}
