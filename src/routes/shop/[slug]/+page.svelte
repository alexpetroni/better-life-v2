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

<div class="mx-auto max-w-[1000px] px-6 py-12">
	<a href="/shop" class="meta hover:text-brand-700">← Înapoi la magazin</a>

	<div class="mt-8 grid gap-10 md:grid-cols-2">
		<div>
			{#if product.image_url}
				<img src={product.image_url} alt={product.name} class="aspect-[4/3] w-full bg-photo object-cover" />
			{:else}
				<div class="aspect-[4/3] w-full bg-photo"></div>
			{/if}
		</div>

		<div class="flex flex-col">
			<p class="kicker">{product.type === 'digital' ? 'Descărcare instantă' : 'Livrare prin curier'}</p>
			<h1 class="headline mt-2 text-3xl font-semibold leading-tight md:text-4xl">{product.name}</h1>
			<p class="mt-4 font-serif text-lg leading-relaxed text-ink/75">{product.description}</p>

			<div class="mt-8 border-t border-rule pt-6">
				<p class="font-mono text-3xl text-ink">{price}</p>
				<button
					onclick={addToCart}
					class="mt-4 w-full rounded-sm bg-brand-600 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
					disabled={added}
				>
					{added ? '✓ Adăugat în coș' : 'Adaugă în coș'}
				</button>
				<p class="meta mt-3 normal-case tracking-normal">
					{#if product.type === 'physical'}
						Livrare în 24–48h. Transport 15 lei (gratuit peste 200 lei).
					{:else}
						Acces imediat după finalizarea plății.
					{/if}
				</p>
			</div>
		</div>
	</div>
</div>
