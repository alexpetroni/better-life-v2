<script lang="ts">
	import { cart } from '$lib/cart.svelte.js';

	interface Props {
		id: string;
		slug: string;
		name: string;
		description: string;
		priceCents: number;
		type: 'physical' | 'digital';
		imageUrl?: string | null;
	}

	const { id, slug, name, description, priceCents, type, imageUrl }: Props = $props();

	const price = $derived(
		new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(priceCents / 100)
	);

	function addToCart() {
		cart.add({ productId: id, slug, name, priceCents, type });
	}
</script>

<div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
	<a href="/shop/{slug}" class="block">
		{#if imageUrl}
			<img src={imageUrl} alt={name} class="h-48 w-full object-cover" />
		{:else}
			<div class="h-48 w-full bg-brand-100 flex items-center justify-center">
				<span class="text-brand-400 text-4xl">📦</span>
			</div>
		{/if}
	</a>
	<div class="flex flex-1 flex-col p-4">
		<div class="mb-2 flex items-start justify-between gap-2">
			<a href="/shop/{slug}" class="font-semibold text-gray-900 hover:text-brand-700 leading-tight">{name}</a>
			<span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium {type === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">
				{type === 'digital' ? 'digital' : 'fizic'}
			</span>
		</div>
		<p class="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">{description}</p>
		<div class="flex items-center justify-between gap-2 mt-auto">
			<span class="text-lg font-bold text-brand-700">{price}</span>
			<button
				onclick={addToCart}
				class="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition"
			>
				Adaugă în coș
			</button>
		</div>
	</div>
</div>
