<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import QuizCtaBanner from '$lib/components/QuizCtaBanner.svelte';

	const { data } = $props();
	const post = $derived(data.post);
	const metadata = $derived(post.metadata);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const PostContent = $derived(post.component as any);

	const formattedDate = $derived(
		new Intl.DateTimeFormat('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' }).format(
			new Date(metadata.date)
		)
	);

	const formattedUpdated = $derived(
		metadata.updated
			? new Intl.DateTimeFormat('ro-RO', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(new Date(metadata.updated))
			: null
	);

	const relatedProductItems = $derived(data.relatedProductItems ?? []);
</script>

<svelte:head>
	<title>{metadata.title} — Better Life</title>
	<meta name="description" content={metadata.description} />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:type" content="article" />
	{#if metadata.date}
		<meta property="article:published_time" content={metadata.date} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="mb-8">
		<a href="/blog" class="text-sm text-gray-500 hover:text-brand-700">← Înapoi la blog</a>
	</div>

	<header class="mb-8">
		<div class="mb-3 flex items-center gap-3">
			<a
				href="/topics/{metadata.topic}"
				class="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium capitalize text-brand-700 hover:bg-brand-200 transition"
			>
				{metadata.topic}
			</a>
			<time datetime={metadata.date} class="text-sm text-gray-400">{formattedDate}</time>
			{#if formattedUpdated}
				<span class="text-sm text-gray-400">· Actualizat: {formattedUpdated}</span>
			{/if}
		</div>
		<h1 class="text-3xl font-bold text-gray-900 leading-tight">{metadata.title}</h1>
		<p class="mt-3 text-lg text-gray-600">{metadata.description}</p>
	</header>

	<div class="prose prose-brand max-w-none prose-headings:font-bold prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
		<PostContent />
	</div>

	{#if metadata.quizCta}
		<div class="mt-10">
			<QuizCtaBanner quizSlug={metadata.quizCta} />
		</div>
	{/if}

	{#if relatedProductItems.length > 0}
		<div class="mt-10">
			<h2 class="mb-5 text-xl font-bold text-gray-900">Produse recomandate</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each relatedProductItems as product (product.id)}
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
