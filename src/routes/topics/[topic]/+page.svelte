<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();
	const topic = $derived(data.topic);
</script>

<Seo title={topic.name} description={topic.tagline} />

<div class="max-w-3xl mx-auto px-4 py-16">
	<div class="text-center mb-10">
		<div class="text-5xl mb-4">{topic.emoji}</div>
		<h1 class="text-3xl font-bold text-gray-900 mb-3">{topic.name}</h1>
		<p class="text-lg text-gray-600">{topic.tagline}</p>
	</div>

	{#if topic.quizSlug}
		<div class="text-center mb-12">
			<a
				href="/quiz/{topic.quizSlug}"
				class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
			>
				{m.cta_start_quiz()}
			</a>
		</div>
	{/if}

	{#if data.posts && data.posts.length > 0}
		<div class="mt-8">
			<h2 class="mb-5 text-xl font-bold text-gray-900">Articole recente</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each data.posts as post (post.slug)}
					<PostCard
						slug={post.slug}
						title={post.metadata.title}
						description={post.metadata.description}
						topic={post.metadata.topic}
						date={post.metadata.date}
					/>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.products && data.products.length > 0}
		<div class="mt-8">
			<h2 class="text-xl font-bold text-gray-900 mb-5">Produse recomandate</h2>
			<div class="grid gap-5 sm:grid-cols-2">
				{#each data.products as product (product.id)}
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
</div>
