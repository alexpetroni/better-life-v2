<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import EditorialImage from '$lib/components/EditorialImage.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getTopic } from '$lib/content/topics.js';
	import type { Post } from '$lib/blog.js';

	const { data } = $props();

	function kicker(topic: string) {
		return (getTopic(topic)?.name ?? 'Better Life').toUpperCase();
	}
	function fmt(date: string) {
		return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
			.format(new Date(date))
			.toUpperCase();
	}
</script>

<Seo
	title={m.site_name()}
	description="Teste personalizate și sfaturi practice pentru un somn mai bun, obiceiuri mai sănătoase și o viață mai împlinită."
/>

{#snippet kickerLine(post: Post)}
	<a href="/topics/{post.metadata.topic}" class="kicker hover:underline">{kicker(post.metadata.topic)}</a>
{/snippet}

<div class="mx-auto max-w-[1200px] px-6">
	<!-- ===== Hero: 3-column editorial grid ===== -->
	<section
		class="grid grid-cols-1 gap-y-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-y-0"
	>
		<!-- LEFT: two stacked stories -->
		<div class="flex flex-col lg:pr-8">
			{#each data.left as post, i (post.slug)}
				<article class={i > 0 ? 'mt-8 border-t border-rule pt-8' : ''}>
					<a href="/blog/{post.slug}" class="block">
						<EditorialImage topic={post.metadata.topic} class="mb-4" />
					</a>
					{@render kickerLine(post)}
					<h2 class="mt-2">
						<a href="/blog/{post.slug}" class="headline text-2xl">{post.metadata.title}</a>
					</h2>
					<p class="meta mt-3">{fmt(post.metadata.date)}</p>
				</article>
			{/each}
		</div>

		<!-- CENTER: featured -->
		{#if data.featured}
			<div class="lg:border-x lg:border-rule lg:px-10">
				<a href="/blog/{data.featured.slug}" class="block">
					<EditorialImage topic={data.featured.metadata.topic} variant="art" ratio="5 / 4" />
				</a>
				<div class="mt-6 text-center">
					{@render kickerLine(data.featured)}
					<h1 class="mt-3">
						<a
							href="/blog/{data.featured.slug}"
							class="headline text-4xl md:text-[2.75rem] md:leading-[1.08]"
						>
							{data.featured.metadata.title}
						</a>
					</h1>
					<p class="mx-auto mt-4 max-w-md font-serif text-lg leading-snug text-ink/80">
						{data.featured.metadata.description}
					</p>
					<p class="meta mt-4">{fmt(data.featured.metadata.date)}</p>
				</div>
			</div>
		{/if}

		<!-- RIGHT: rail list with thumbnails -->
		<div class="flex flex-col lg:pl-8">
			{#each data.rail as post, i (post.slug)}
				<article class="flex gap-4 {i > 0 ? 'mt-5 border-t border-rule pt-5' : ''}">
					<div class="min-w-0 flex-1">
						{@render kickerLine(post)}
						<h3 class="mt-1.5">
							<a href="/blog/{post.slug}" class="headline text-[1.05rem]">{post.metadata.title}</a>
						</h3>
						<p class="meta mt-2">{fmt(post.metadata.date)}</p>
					</div>
					<a href="/blog/{post.slug}" class="shrink-0">
						<EditorialImage topic={post.metadata.topic} ratio="1 / 1" class="w-16" />
					</a>
				</article>
			{/each}
		</div>
	</section>

	<!-- ===== Quiz funnel band ===== -->
	<section class="my-4 border-y-2 border-ink py-10 text-center">
		<p class="kicker">Testează-te</p>
		<h2 class="mx-auto mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
			Descoperă-ți profilul și primește un plan personalizat pe email
		</h2>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a
				href="/quiz/somn"
				class="rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
			>
				Testul de somn
			</a>
			<a
				href="/quiz/obiceiuri"
				class="rounded-sm border border-ink px-6 py-3 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
			>
				Testul de obiceiuri
			</a>
		</div>
	</section>

	<!-- ===== Story strip ===== -->
	<section class="border-t border-rule pt-10">
		<div class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
			{#each data.grid as post (post.slug)}
				<article>
					<a href="/blog/{post.slug}" class="block">
						<EditorialImage topic={post.metadata.topic} class="mb-3" />
					</a>
					{@render kickerLine(post)}
					<h3 class="mt-1.5">
						<a href="/blog/{post.slug}" class="headline text-lg">{post.metadata.title}</a>
					</h3>
				</article>
			{/each}
		</div>
	</section>

	<!-- ===== Latest list ===== -->
	<section class="mt-16 border-t-2 border-ink pt-6">
		<h2 class="meta mb-6 !text-ink">Cele mai noi</h2>
		<div class="grid grid-cols-1 gap-x-12 md:grid-cols-2">
			{#each data.latest as post, i (post.slug)}
				<article class="flex items-baseline gap-4 border-b border-rule py-4">
					<span class="meta w-6 shrink-0 text-brand-600">{i + 1}</span>
					<div>
						<a href="/blog/{post.slug}" class="headline text-xl">{post.metadata.title}</a>
						<p class="meta mt-1.5">{kicker(post.metadata.topic)} · {fmt(post.metadata.date)}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>
