<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import EditorialImage from '$lib/components/EditorialImage.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getTopic } from '$lib/content/topics.js';

	const { data } = $props();
	const quiz = $derived(data.quiz);
	const kicker = $derived((getTopic(quiz.topic)?.name ?? 'Better Life').toUpperCase());

	const steps = [
		{ t: 'Răspunzi la întrebări simple', d: 'Durează aproximativ 2 minute.' },
		{ t: 'Primești profilul tău personalizat', d: 'Analizăm răspunsurile și îți identificăm tiparul.' },
		{ t: 'Un plan gratuit de 2 săptămâni pe email', d: 'Sfaturi practice adaptate profilului tău, livrate pas cu pas.' }
	];
</script>

<Seo title={quiz.title} description={quiz.description} ogImage="/og/quiz-{quiz.slug}.png" />

<div class="mx-auto max-w-[680px] px-6 py-14 text-center">
	<p class="kicker">{kicker}</p>
	<h1 class="headline mt-3 text-4xl font-semibold leading-[1.08] md:text-5xl">{quiz.title}</h1>
	<p class="mx-auto mt-4 max-w-md font-serif text-xl leading-snug text-ink/75">{quiz.description}</p>
	<p class="meta mt-4">{quiz.questions.length} întrebări · ~2 minute</p>

	<a
		href="/quiz/{quiz.slug}/play"
		class="mt-8 inline-block rounded-sm bg-brand-600 px-10 py-4 font-sans text-base font-medium text-white transition-colors hover:bg-brand-700"
	>
		{m.cta_start_quiz()}
	</a>

	<p class="meta mt-5 normal-case tracking-normal">
		Peste 10.000 de persoane și-au descoperit deja profilul.
	</p>

	<div class="mx-auto mt-12 max-w-md">
		<EditorialImage variant="art" topic={quiz.topic} ratio="16 / 9" />
	</div>

	<div class="mt-12 border-t-2 border-ink pt-8 text-left">
		<p class="kicker text-center">Cum funcționează</p>
		<div class="mt-6 space-y-6">
			{#each steps as step, i}
				<div class="flex gap-5 border-b border-rule pb-6 last:border-0">
					<span class="font-serif text-3xl font-semibold leading-none text-brand-600">{i + 1}</span>
					<div>
						<p class="font-serif text-xl font-semibold text-ink">{step.t}</p>
						<p class="mt-1 font-serif text-ink/65">{step.d}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
