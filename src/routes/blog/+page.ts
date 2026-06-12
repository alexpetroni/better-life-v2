export const prerender = true;

import { getAllPosts } from '$lib/blog.js';

export function load() {
	return { posts: getAllPosts() };
}
