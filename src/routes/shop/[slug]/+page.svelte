<script lang="ts">
	import { cart } from '$lib/cart.svelte.js';

	const { data } = $props();
	const product = $derived(data.product);

	const price = $derived(
		new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
			product.price_cents / 100
		)
	);

	let added = $state(false);

	function addToCart() {
		cart.add({
			productId: product.id,
			slug: product.slug,
			name: product.name,
			priceCents: product.price_cents,
			type: product.type as 'physical' | 'digital'
		});
		added = true;
		setTimeout(() => (added = false), 2000);
	}
</script>

<svelte:head>
	<title>{product.name} — Better Life</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<a href="/shop" class="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700">
		← Înapoi la magazin
	</a>

	<div class="grid gap-8 md:grid-cols-2">
		<div>
			{#if product.image_url}
				<img
					src={product.image_url}
					alt={product.name}
					class="w-full rounded-xl object-cover shadow-md"
				/>
			{:else}
				<div class="flex h-64 w-full items-center justify-center rounded-xl bg-brand-100">
					<span class="text-6xl">📦</span>
				</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<div class="mb-3">
				<span class="rounded-full px-3 py-1 text-sm font-medium {product.type === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">
					{product.type === 'digital' ? 'Descărcare instantă' : 'Livrare prin curier'}
				</span>
			</div>

			<h1 class="mb-4 text-2xl font-bold text-gray-900">{product.name}</h1>
			<p class="mb-6 text-gray-600 leading-relaxed">{product.description}</p>

			<div class="mt-auto">
				<p class="mb-4 text-3xl font-bold text-brand-700">{price}</p>
				<button
					onclick={addToCart}
					class="w-full rounded-xl bg-brand-600 py-3 text-base font-semibold text-white hover:bg-brand-700 transition disabled:opacity-60"
					disabled={added}
				>
					{added ? '✓ Adăugat în coș' : 'Adaugă în coș'}
				</button>
				{#if product.type === 'physical'}
					<p class="mt-2 text-center text-sm text-gray-500">Livrare în 24–48h. Transport 15 lei (gratuit peste 200 lei).</p>
				{:else}
					<p class="mt-2 text-center text-sm text-gray-500">Acces imediat după finalizarea plății.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
