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

<div class="flex min-h-screen flex-col bg-white text-ink">
	<!-- thin masthead bar -->
	<div class="h-2 bg-black"></div>

	<header class="border-b border-rule">
		<div
			class="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5"
		>
			<!-- left: utilities + sections -->
			<nav class="flex items-center gap-5 font-sans text-[0.8rem] text-ink">
				<button aria-label="Meniu" class="hover:text-brand-700">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
						<line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
					</svg>
				</button>
				<button aria-label="Caută" class="hover:text-brand-700">
					<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
						<circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
					</svg>
				</button>
				<a href="/blog" class="hidden tracking-wide hover:text-brand-700 sm:inline">{m.nav_blog()}</a>
				<a href="/shop" class="hidden tracking-wide hover:text-brand-700 sm:inline">{m.nav_shop()}</a>
				<a href="/quiz" class="hidden tracking-wide hover:text-brand-700 md:inline">{m.nav_quizzes()}</a>
			</nav>

			<!-- center: masthead -->
			<a href="/" class="flex flex-col items-center leading-none">
				<span class="font-serif text-5xl font-bold leading-none text-brand-600 md:text-6xl">B</span>
				<span class="mt-1 font-serif text-xl italic tracking-tight md:text-2xl">Better Life</span>
			</a>

			<!-- right: actions -->
			<div class="flex items-center justify-end gap-5 font-sans text-[0.8rem]">
				<a href="/cart" class="hidden tracking-wide hover:text-brand-700 sm:inline">{m.nav_cart()}</a>
				<a
					href="/quiz/somn"
					class="rounded-sm bg-brand-600 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-700"
				>
					{m.cta_start_quiz()}
				</a>
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-20 bg-[#111110] text-gray-400">
		<div class="mx-auto max-w-[1200px] px-6 py-16">
			<div class="grid grid-cols-2 gap-10 font-sans text-[0.85rem] md:grid-cols-4">
				<div>
					<p class="meta mb-4 text-gray-500">Better Life</p>
					<ul class="space-y-2">
						<li><a href="/" class="hover:text-white">Despre noi</a></li>
						<li><a href="/blog" class="hover:text-white">Echipa</a></li>
						<li><a href="/blog" class="hover:text-white">Contact</a></li>
					</ul>
				</div>
				<div>
					<p class="meta mb-4 text-gray-500">Secțiuni</p>
					<ul class="space-y-2">
						<li><a href="/topics/somn" class="hover:text-white">Better Sleep</a></li>
						<li><a href="/topics/obiceiuri" class="hover:text-white">Better Habits</a></li>
						<li><a href="/blog" class="hover:text-white">{m.nav_blog()}</a></li>
						<li><a href="/shop" class="hover:text-white">{m.nav_shop()}</a></li>
					</ul>
				</div>
				<div>
					<p class="meta mb-4 text-gray-500">Resurse</p>
					<ul class="space-y-2">
						<li><a href="/quiz" class="hover:text-white">{m.nav_quizzes()}</a></li>
						<li><a href="/quiz/somn" class="hover:text-white">{m.cta_start_quiz()}</a></li>
					</ul>
				</div>
				<div>
					<p class="meta mb-4 text-gray-500">Legal</p>
					<ul class="space-y-2">
						<li><a href="/privacy" class="hover:text-white">Confidențialitate</a></li>
						<li><a href="/termeni" class="hover:text-white">Termeni</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-14 flex items-center justify-between border-t border-white/15 pt-6">
				<p class="meta text-gray-600">© 2026 Better Life</p>
				<span class="font-serif text-2xl italic text-white">Better Life</span>
			</div>
		</div>
	</footer>
</div>
