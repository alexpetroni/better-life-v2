<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
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
		<div class="text-center">
			<a
				href="/quiz/{topic.quizSlug}"
				class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
			>
				{m.cta_start_quiz()}
			</a>
		</div>
	{/if}
</div>
