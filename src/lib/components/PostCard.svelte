<script lang="ts">
	interface Props {
		slug: string;
		title: string;
		description: string;
		topic: string;
		date: string;
	}

	const { slug, title, description, topic, date }: Props = $props();

	const formattedDate = $derived(
		new Intl.DateTimeFormat('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' }).format(
			new Date(date)
		)
	);
</script>

<article class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
	<div class="flex items-center gap-2">
		<a
			href="/topics/{topic}"
			class="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-700 hover:bg-brand-200 transition"
		>
			{topic}
		</a>
		<time datetime={date} class="text-xs text-gray-400">{formattedDate}</time>
	</div>
	<a href="/blog/{slug}" class="group">
		<h2 class="text-base font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">
			{title}
		</h2>
	</a>
	<p class="text-sm text-gray-600 line-clamp-2">{description}</p>
	<a href="/blog/{slug}" class="mt-auto text-sm font-medium text-brand-600 hover:text-brand-800 transition">
		Citește articolul →
	</a>
</article>
