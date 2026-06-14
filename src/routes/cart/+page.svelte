<script lang="ts">
	import { cart } from '$lib/cart.svelte.js';
	import { FREE_SHIPPING_THRESHOLD_CENTS, standardShipping } from '$lib/content/shipping.js';
	import { track } from '@vercel/analytics';

	const formatRon = (cents: number) =>
		new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(cents / 100);

	let checkoutError = $state<string | null>(null);
	let loading = $state(false);

	const hasPhysical = $derived(cart.items.some((i) => i.type === 'physical'));
	const shippingCents = $derived(
		hasPhysical && cart.totalCents < FREE_SHIPPING_THRESHOLD_CENTS ? standardShipping.priceCents : 0
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
				checkoutError =
					res.status === 503
						? 'Plățile nu sunt încă activate.'
						: (data.message ?? 'A apărut o eroare. Încearcă din nou.');
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
	<title>Coș de cumpărături — Better Life</title>
</svelte:head>

<div class="mx-auto max-w-[760px] px-6 py-12">
	<header class="border-b-2 border-ink pb-4">
		<p class="kicker">Comandă</p>
		<h1 class="headline mt-2 text-4xl font-semibold">Coșul tău</h1>
	</header>

	{#if cart.items.length === 0}
		<div class="border-b border-rule py-16 text-center">
			<p class="font-serif text-lg text-ink/70">Coșul tău este gol.</p>
			<a
				href="/shop"
				class="mt-5 inline-block rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
			>
				Mergi la magazin
			</a>
		</div>
	{:else}
		<div class="mt-2">
			{#each cart.items as item (item.productId)}
				<div class="flex items-center gap-4 border-b border-rule py-5">
					<div class="min-w-0 flex-1">
						<a href="/shop/{item.slug}" class="headline block truncate text-lg">{item.name}</a>
						<p class="meta mt-1">{item.type === 'digital' ? 'Produs digital' : 'Produs fizic'}</p>
					</div>
					<div class="flex items-center">
						<button
							onclick={() => cart.setQuantity(item.productId, item.quantity - 1)}
							class="flex h-8 w-8 items-center justify-center border border-rule text-lg leading-none text-ink transition-colors hover:border-ink"
							aria-label="Scade">−</button
						>
						<span class="w-8 text-center font-mono text-sm">{item.quantity}</span>
						<button
							onclick={() => cart.setQuantity(item.productId, item.quantity + 1)}
							class="flex h-8 w-8 items-center justify-center border border-rule text-lg leading-none text-ink transition-colors hover:border-ink"
							aria-label="Crește">+</button
						>
					</div>
					<span class="w-24 text-right font-mono text-sm">{formatRon(item.priceCents * item.quantity)}</span>
					<button
						onclick={() => cart.remove(item.productId)}
						class="text-ink/40 transition-colors hover:text-brand-700"
						aria-label="Șterge">✕</button
					>
				</div>
			{/each}
		</div>

		<div class="mt-8">
			{#if hasPhysical}
				<p class="meta mb-4 normal-case tracking-normal {remainingForFree > 0 ? 'text-ink/70' : 'text-brand-700'}">
					{#if remainingForFree > 0}
						Mai adaugă {formatRon(remainingForFree)} pentru livrare gratuită.
					{:else}
						Ai livrare gratuită.
					{/if}
				</p>
			{/if}

			<div class="flex justify-between border-t border-rule py-2 font-serif text-ink/70">
				<span>Subtotal</span><span class="font-mono">{formatRon(cart.totalCents)}</span>
			</div>
			{#if hasPhysical}
				<div class="flex justify-between border-t border-rule py-2 font-serif text-ink/70">
					<span>Transport</span>
					<span class="font-mono">{shippingCents === 0 ? 'Gratuit' : formatRon(shippingCents)}</span>
				</div>
			{/if}
			<div class="flex justify-between border-y-2 border-ink py-3 font-serif text-xl font-semibold">
				<span>Total estimativ</span>
				<span class="font-mono">{formatRon(cart.totalCents + shippingCents)}</span>
			</div>

			{#if checkoutError}
				<p class="mt-4 font-serif text-brand-700">{checkoutError}</p>
			{/if}

			<button
				onclick={checkout}
				disabled={loading}
				class="mt-6 w-full rounded-sm bg-brand-600 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
			>
				{loading ? 'Se procesează…' : 'Finalizează comanda'}
			</button>
		</div>
	{/if}
</div>
