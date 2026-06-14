<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { getTopic } from '$lib/content/topics.js';

	const { data } = $props();

	const topics = $derived(
		[...new Set(data.products.map((p) => p.topic).filter(Boolean))]
	) as string[];
	let selectedTopic = $state<string | null>(null);

	const filtered = $derived(
		selectedTopic ? data.products.filter((p) => p.topic === selectedTopic) : data.products
	);

	const label = (topic: string) => getTopic(topic)?.name ?? topic;
</script>

<svelte:head>
	<title>Magazin — Better Life</title>
</svelte:head>

<div class="mx-auto max-w-[1100px] px-6 py-12">
	<header class="border-b-2 border-ink pb-4">
		<p class="kicker">Magazin</p>
		<h1 class="headline mt-2 text-4xl font-semibold md:text-5xl">Produse & resurse</h1>
		<p class="mt-3 font-serif text-lg text-ink/70">
			Obiecte și ghiduri alese pentru un somn mai bun și obiceiuri care durează.
		</p>
	</header>

	{#if topics.length > 0}
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

	{#if filtered.length === 0}
		<p class="font-serif text-ink/60">Niciun produs disponibil în această categorie.</p>
	{:else}
		<div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filtered as product (product.id)}
				<ProductCard
					id={product.id}
					slug={product.slug}
					name={product.name}
					description={product.description}
					priceCents={product.price_cents}
					type={product.type as 'physical' | 'digital'}
					imageUrl={product.image_url}
				/>
			{/each}
		</div>
	{/if}
</div>
