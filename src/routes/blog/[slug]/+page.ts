import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '$lib/blog.js';

export const prerender = true;

export async function entries() {
	return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function load({ params, data }) {
	const post = await getPost(params.slug);
	if (!post) {
		throw error(404, 'Articolul nu a fost găsit.');
	}
	return { post, relatedProductItems: data.relatedProductItems };
}

