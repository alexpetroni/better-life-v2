<script lang="ts">
	import EditorialImage from './EditorialImage.svelte';
	import { getTopic } from '$lib/content/topics.js';

	interface Props {
		slug: string;
		title: string;
		description: string;
		topic: string;
		date: string;
	}

	const { slug, title, description, topic, date }: Props = $props();

	const kicker = $derived((getTopic(topic)?.name ?? 'Better Life').toUpperCase());
	const formattedDate = $derived(
		new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
			.format(new Date(date))
			.toUpperCase()
	);
</script>

<article class="flex flex-col">
	<a href="/blog/{slug}" class="block">
		<EditorialImage {topic} class="mb-3" />
	</a>
	<a href="/topics/{topic}" class="kicker hover:underline">{kicker}</a>
	<h2 class="mt-1.5">
		<a href="/blog/{slug}" class="headline text-xl">{title}</a>
	</h2>
	<p class="mt-2 line-clamp-2 font-serif text-[0.95rem] leading-snug text-ink/70">{description}</p>
	<p class="meta mt-2">{formattedDate}</p>
</article>
