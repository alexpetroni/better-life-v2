<script lang="ts">
	import { cart } from '$lib/cart.svelte.js';
	import { FREE_SHIPPING_THRESHOLD_CENTS, standardShipping } from '$lib/content/shipping.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { track } from '@vercel/analytics';

	const formatRon = (cents: number) =>
		new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(cents / 100);

	let checkoutError = $state<string | null>(null);
	let loading = $state(false);

	const hasPhysical = $derived(cart.items.some((i) => i.type === 'physical'));
	const shippingCents = $derived(
		hasPhysical && cart.totalCents < FREE_SHIPPING_THRESHOLD_CENTS
			? standardShipping.priceCents
			: 0
	);
	const remainingForFree = $derived(
		hasPhysical ? Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - cart.totalCents) : 0
	);

	async function checkout() {
		loading = true;
		checkoutError = null;
		track('checkout_started', { item_count: cart.items.length });
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
				})
			});
			const data = await res.json();
			if (!res.ok) {
				if (res.status === 503) {
					checkoutError = 'Plățile nu sunt încă activate.';
				} else {
					checkoutError = data.message ?? 'A apărut o eroare. Încearcă din nou.';
				}
				return;
			}
			if (data.url) {
				window.location.href = data.url;
			}
		} catch {
			checkoutError = 'A apărut o eroare de rețea. Încearcă din nou.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Coș de cumpărături — Viață Mai Bună</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-8 text-2xl font-bold text-gray-900">Coș de cumpărături</h1>

	{#if cart.items.length === 0}
		<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
			<p class="mb-4 text-gray-500">Coșul tău este gol.</p>
			<a href="/shop" class="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
				Mergi la magazin
			</a>
		</div>
	{:else}
		<div class="rounded-xl border border-gray-200 bg-white overflow-hidden">
			{#each cart.items as item (item.productId)}
				<div class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
					<div class="flex-1 min-w-0">
						<a href="/shop/{item.slug}" class="font-medium text-gray-900 hover:text-brand-700 truncate block">
							{item.name}
						</a>
						<span class="text-xs text-gray-400">{item.type === 'digital' ? 'digital' : 'fizic'}</span>
					</div>
					<div class="flex items-center gap-2">
						<button
							onclick={() => cart.setQuantity(item.productId, item.quantity - 1)}
							class="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-600 transition flex items-center justify-center text-lg leading-none"
						>−</button>
						<span class="w-6 text-center text-sm font-medium">{item.quantity}</span>
						<button
							onclick={() => cart.setQuantity(item.productId, item.quantity + 1)}
							class="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-600 transition flex items-center justify-center text-lg leading-none"
						>+</button>
					</div>
					<span class="w-20 text-right font-medium text-gray-900">
						{formatRon(item.priceCents * item.quantity)}
					</span>
					<button
						onclick={() => cart.remove(item.productId)}
						class="text-gray-400 hover:text-red-500 transition text-sm"
						aria-label="Șterge"
					>✕</button>
				</div>
			{/each}
		</div>

		<div class="mt-6 rounded-xl border border-gray-200 bg-white p-6">
			{#if hasPhysical}
				{#if remainingForFree > 0}
					<p class="mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
						Mai adaugă <strong>{formatRon(remainingForFree)}</strong> pentru livrare gratuită.
					</p>
				{:else}
					<p class="mb-4 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2">
						✓ Ai livrare gratuită!
					</p>
				{/if}
			{/if}

			<div class="flex justify-between text-sm text-gray-600 mb-1">
				<span>Subtotal</span>
				<span>{formatRon(cart.totalCents)}</span>
			</div>
			{#if hasPhysical}
				<div class="flex justify-between text-sm text-gray-600 mb-3">
					<span>Transport</span>
					<span>{shippingCents === 0 ? 'Gratuit' : formatRon(shippingCents)}</span>
				</div>
			{/if}
			<div class="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-3">
				<span>Total estimativ</span>
				<span>{formatRon(cart.totalCents + shippingCents)}</span>
			</div>

			{#if checkoutError}
				<div class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
					{checkoutError}
				</div>
			{/if}

			<button
				onclick={checkout}
				disabled={loading}
				class="mt-4 w-full rounded-xl bg-brand-600 py-3 text-base font-semibold text-white hover:bg-brand-700 transition disabled:opacity-60"
			>
				{loading ? 'Se procesează…' : 'Finalizează comanda'}
			</button>
		</div>
	{/if}
</div>
