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

<div class="flex flex-col">
	<a href="/shop/{slug}" class="block">
		{#if imageUrl}
			<img src={imageUrl} alt={name} class="aspect-[4/3] w-full bg-photo object-cover" />
		{:else}
			<div class="aspect-[4/3] w-full bg-photo"></div>
		{/if}
	</a>
	<p class="meta mt-3">{type === 'digital' ? 'Produs digital' : 'Produs fizic'}</p>
	<a href="/shop/{slug}" class="headline mt-1 text-lg">{name}</a>
	<p class="mt-1.5 line-clamp-2 font-serif text-sm leading-snug text-ink/65">{description}</p>
	<div class="mt-3 flex items-center justify-between border-t border-rule pt-3">
		<span class="font-mono text-sm text-ink">{price}</span>
		<button
			onclick={addToCart}
			class="font-sans text-xs font-semibold uppercase tracking-wide text-brand-700 transition-colors hover:text-brand-900"
		>
			Adaugă în coș
		</button>
	</div>
</div>
