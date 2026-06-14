<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import QuizCtaBanner from '$lib/components/QuizCtaBanner.svelte';
	import EditorialImage from '$lib/components/EditorialImage.svelte';
	import { getTopic } from '$lib/content/topics.js';

	const { data } = $props();
	const post = $derived(data.post);
	const metadata = $derived(post.metadata);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const PostContent = $derived(post.component as any);

	const kicker = $derived((getTopic(metadata.topic)?.name ?? 'Better Life').toUpperCase());
	const fmt = (d: string) =>
		new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
			.format(new Date(d))
			.toUpperCase();

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

<article class="pb-8">
	<!-- Header -->
	<div class="mx-auto max-w-[720px] px-6 pt-10">
		<a href="/topics/{metadata.topic}" class="kicker hover:underline">{kicker}</a>
		<h1 class="headline mt-3 text-4xl font-semibold leading-[1.08] md:text-[3.25rem]">
			{metadata.title}
		</h1>
		<p class="mt-4 font-serif text-xl leading-snug text-ink/75">{metadata.description}</p>
	</div>

	<!-- Lead image -->
	<figure class="mx-auto mt-8 max-w-[940px] px-6">
		<EditorialImage variant="art" topic={metadata.topic} ratio="16 / 9" />
		<figcaption class="meta mt-2">Ilustrație Better Life</figcaption>
	</figure>

	<!-- Meta row + body -->
	<div class="mx-auto max-w-[720px] px-6">
		<div class="mt-8 flex items-center justify-between border-y border-rule py-3">
			<time datetime={metadata.date} class="meta">
				{fmt(metadata.date)}{#if metadata.updated} · Actualizat {fmt(metadata.updated)}{/if}
			</time>
			<div class="flex gap-6">
				<span class="meta">Distribuie</span>
				<span class="meta">Salvează</span>
			</div>
		</div>

		<div
			class="prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline"
		>
			<PostContent />
		</div>

		{#if metadata.quizCta}
			<QuizCtaBanner quizSlug={metadata.quizCta} />
		{/if}

		{#if relatedProductItems.length > 0}
			<h2 class="meta mt-12 border-t-2 border-ink pt-4 !text-ink">Produse recomandate</h2>
			<div class="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2">
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
		{/if}

		<div class="mt-12 border-t border-rule pt-6">
			<a href="/blog" class="meta hover:text-brand-700">← Înapoi la blog</a>
		</div>
	</div>
</article>
