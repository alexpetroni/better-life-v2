<script lang="ts">
	import '../app.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import * as m from '$lib/paraglide/messages.js';

	if (!dev) {
		inject();
	}

	interface Props {
		children: import('svelte').Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="bg-brand-600 text-white shadow-sm">
		<nav class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight hover:opacity-90">
				{m.site_name()}
			</a>
			<ul class="flex gap-6 text-sm font-medium">
				<li><a href="/" class="hover:text-brand-100 transition-colors">{m.nav_home()}</a></li>
				<li><a href="/blog" class="hover:text-brand-100 transition-colors">{m.nav_blog()}</a></li>
				<li><a href="/shop" class="hover:text-brand-100 transition-colors">{m.nav_shop()}</a></li>
				<li><a href="/quiz" class="hover:text-brand-100 transition-colors">{m.nav_quizzes()}</a></li>
					<li><a href="/cart" class="hover:text-brand-100 transition-colors">{m.nav_cart()}</a></li>
			</ul>
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="bg-gray-900 text-gray-300 py-10">
		<div class="max-w-5xl mx-auto px-4 text-center">
			<p class="text-lg font-medium text-white mb-2">{m.site_name()}</p>
			<p class="text-sm mb-4">{m.footer_tagline()}</p>
			<ul class="flex justify-center gap-6 text-sm">
				<li><a href="/privacy" class="hover:text-white transition-colors">Confidențialitate</a></li>
				<li><a href="/termeni" class="hover:text-white transition-colors">Termeni</a></li>
			</ul>
		</div>
	</footer>
</div>
