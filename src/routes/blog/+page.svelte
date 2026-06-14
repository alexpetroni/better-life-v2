<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import { getTopic } from '$lib/content/topics.js';

	const { data } = $props();

	const topics = $derived([...new Set(data.posts.map((p) => p.metadata.topic))]);
	let selectedTopic = $state<string | null>(null);

	const filtered = $derived(
		selectedTopic ? data.posts.filter((p) => p.metadata.topic === selectedTopic) : data.posts
	);

	const label = (topic: string) => getTopic(topic)?.name ?? topic;
</script>

<svelte:head>
	<title>Blog — Better Life</title>
	<meta
		name="description"
		content="Articole despre somn, obiceiuri și o viață mai bună, scrise de experți."
	/>
</svelte:head>

<div class="mx-auto max-w-[1100px] px-6 py-12">
	<header class="border-b-2 border-ink pb-4">
		<p class="kicker">Better Life</p>
		<h1 class="headline mt-2 text-4xl font-semibold md:text-5xl">Blog</h1>
		<p class="mt-3 font-serif text-lg text-ink/70">
			Articole practice despre somn, obiceiuri și o viață mai sănătoasă.
		</p>
	</header>

	{#if topics.length > 1}
		<div class="my-8 flex flex-wrap gap-5 font-sans text-xs font-semibold uppercase tracking-wide">
			<button
				onclick={() => (selectedTopic = null)}
				class="transition-colors {selectedTopic === null
					? 'text-brand-700 underline underline-offset-4'
					: 'text-ink/55 hover:text-ink'}"
			>
				Toate
			</button>
			{#each topics as topic}
				<button
					onclick={() => (selectedTopic = topic)}
					class="transition-colors {selectedTopic === topic
						? 'text-brand-700 underline underline-offset-4'
						: 'text-ink/55 hover:text-ink'}"
				>
					{label(topic)}
				</button>
			{/each}
		</div>
	{/if}

	<div class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
		{#each filtered as post (post.slug)}
			<PostCard
				slug={post.slug}
				title={post.metadata.title}
				description={post.metadata.description}
				topic={post.metadata.topic}
				date={post.metadata.date}
			/>
		{:else}
			<p class="col-span-full font-serif text-ink/60">Niciun articol găsit.</p>
		{/each}
	</div>
</div>
