import { getAllPosts } from '$lib/blog.js';

export const prerender = true;

export function load() {
	const posts = getAllPosts();
	return {
		featured: posts[0] ?? null,
		left: posts.slice(1, 3),
		rail: posts.slice(3, 7),
		grid: posts.slice(7, 11),
		latest: posts.slice(11, 20)
	};
}
