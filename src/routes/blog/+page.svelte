<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';

	const { data } = $props();

	const topics = $derived([...new Set(data.posts.map((p) => p.metadata.topic))]);
	let selectedTopic = $state<string | null>(null);

	const filtered = $derived(
		selectedTopic ? data.posts.filter((p) => p.metadata.topic === selectedTopic) : data.posts
	);
</script>

<svelte:head>
	<title>Blog — Viață Mai Bună</title>
	<meta name="description" content="Articole despre somn, obiceiuri și o viață mai bună, scrise de experți." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold text-gray-900">Blog</h1>
	<p class="mb-8 text-gray-600">Articole practice despre somn, obiceiuri și o viață mai sănătoasă.</p>

	{#if topics.length > 1}
		<div class="mb-8 flex flex-wrap gap-2">
			<button
				onclick={() => (selectedTopic = null)}
				class="rounded-full px-4 py-1.5 text-sm font-medium capitalize transition {selectedTopic === null ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				Toate
			</button>
			{#each topics as topic}
				<button
					onclick={() => (selectedTopic = topic)}
					class="rounded-full px-4 py-1.5 text-sm font-medium capitalize transition {selectedTopic === topic ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{topic}
				</button>
			{/each}
		</div>
	{/if}

	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each filtered as post (post.slug)}
			<PostCard
				slug={post.slug}
				title={post.metadata.title}
				description={post.metadata.description}
				topic={post.metadata.topic}
				date={post.metadata.date}
			/>
		{:else}
			<p class="col-span-full text-gray-500">Niciun articol găsit.</p>
		{/each}
	</div>
</div>
