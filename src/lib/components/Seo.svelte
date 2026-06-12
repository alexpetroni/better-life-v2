<script lang="ts">
	interface Props {
		title: string;
		description: string;
		ogImage?: string;
		url?: string;
	}

	const { title, description, ogImage, url }: Props = $props();

	const fullTitle = $derived(title.includes('Viață Mai Bună') ? title : `${title} | Viață Mai Bună`);
	const resolvedOgImage = $derived(ogImage ?? '/og/default.png');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if url}
		<link rel="canonical" href={url} />
	{/if}
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	{#if url}
		<meta property="og:url" content={url} />
	{/if}
	<meta property="og:image" content={resolvedOgImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={resolvedOgImage} />
</svelte:head>
