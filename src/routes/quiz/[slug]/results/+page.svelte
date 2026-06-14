<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { getTopic } from '$lib/content/topics.js';
	const { data } = $props();
</script>

{#if !data.valid}
	<div class="mx-auto max-w-xl px-6 py-20 text-center">
		<p class="kicker">Link invalid</p>
		<h1 class="headline mt-3 text-3xl font-semibold">Linkul nu mai este valabil</h1>
		<p class="mx-auto mt-3 max-w-sm font-serif text-ink/70">
			Linkul de rezultate a expirat sau este invalid. Reia testul pentru a-ți vedea profilul.
		</p>
		<a
			href="/quiz/somn"
			class="mt-6 inline-block rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
		>
			Reia testul
		</a>
	</div>
{:else}
	{@const { quiz, profile } = data}
	<div class="mx-auto max-w-[680px] px-6 py-14">
		<div class="text-center">
			<p class="kicker">{(getTopic(quiz?.topic ?? '')?.name ?? 'Better Life').toUpperCase()} · Rezultatul tău</p>
			<h1 class="headline mt-3 text-4xl font-semibold leading-[1.1] md:text-5xl">{profile?.name}</h1>
			<p class="mx-auto mt-4 max-w-md font-serif text-xl leading-snug text-ink/75">{profile?.teaser}</p>
		</div>

		<div class="mt-10 border-y-2 border-ink py-8 text-center">
			<p class="kicker">Pe drum spre tine</p>
			<p class="mt-2 font-serif text-2xl font-semibold leading-snug">
				Rezultatul complet și planul tău sunt în inbox
			</p>
			<p class="mx-auto mt-3 max-w-md font-serif text-ink/70">
				Ți-am trimis analiza completă și planul personalizat de 2 săptămâni. Confirmă adresa de email
				pentru a-l activa.
			</p>
		</div>

		{#if data.recommendedProducts && data.recommendedProducts.length > 0}
			<div class="mt-12">
				<h2 class="meta border-t-2 border-ink pb-1 pt-4 !text-ink">Recomandate pentru profilul tău</h2>
				<div class="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2">
					{#each data.recommendedProducts as product (product.id)}
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
			</div>
		{/if}

		<div class="mt-12 border-t border-rule pt-6 text-center">
			<p class="font-serif text-ink/70">Cunoști pe cineva care s-ar bucura de acest test?</p>
			<a
				href="/quiz/{quiz?.slug}"
				class="mt-3 inline-block rounded-sm border border-ink px-6 py-3 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
			>
				Distribuie testul
			</a>
		</div>
	</div>
{/if}
