<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	const { data } = $props();

	const topics = $derived([...new Set(data.products.map((p) => p.topic).filter(Boolean))]) as string[];
	let selectedTopic = $state<string | null>(null);

	const filtered = $derived(
		selectedTopic ? data.products.filter((p) => p.topic === selectedTopic) : data.products
	);
</script>

<svelte:head>
	<title>Magazin — Viață Mai Bună</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-12">
	<h1 class="mb-2 text-3xl font-bold text-gray-900">Magazin</h1>
	<p class="mb-8 text-gray-600">Produse și resurse pentru o viață mai bună.</p>

	{#if topics.length > 0}
		<div class="mb-8 flex flex-wrap gap-2">
			<button
				onclick={() => (selectedTopic = null)}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition {selectedTopic === null ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
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

	{#if filtered.length === 0}
		<p class="text-gray-500">Niciun produs disponibil în această categorie.</p>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
