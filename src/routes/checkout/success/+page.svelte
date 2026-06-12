<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '$lib/cart.svelte.js';

	const { data } = $props();

	onMount(() => {
		cart.clear();
	});

	const formatRon = (cents: number | null) =>
		cents != null
			? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(cents / 100)
			: null;
</script>

<svelte:head>
	<title>Comandă confirmată — Viață Mai Bună</title>
</svelte:head>

<div class="mx-auto max-w-xl px-4 py-16 text-center">
	<div class="mb-6 text-6xl">🎉</div>
	<h1 class="mb-3 text-2xl font-bold text-gray-900">Mulțumim pentru comandă!</h1>

	{#if data.summary}
		<p class="mb-2 text-gray-600">
			Comanda ta a fost procesată cu succes.
			{#if data.summary.amountTotal}
				Total: <strong>{formatRon(data.summary.amountTotal)}</strong>
			{/if}
		</p>
		{#if data.summary.email}
			<p class="text-gray-600">
				Vei primi confirmarea și instrucțiunile de livrare la <strong>{data.summary.email}</strong>.
			</p>
		{/if}
	{:else}
		<p class="text-gray-600">
			Vei primi un email de confirmare în câteva minute.
		</p>
	{/if}

	<div class="mt-8">
		<a href="/shop" class="inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 transition">
			Continuă cumpărăturile
		</a>
	</div>
</div>
