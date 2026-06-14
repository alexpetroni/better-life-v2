<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { allQuizzes } from '$lib/content/quizzes/index.js';
	import { getTopic } from '$lib/content/topics.js';
</script>

<Seo title="Teste" description="Descoperă testele noastre personalizate și află profilul tău." />

<div class="mx-auto max-w-[760px] px-6 py-12">
	<header class="border-b-2 border-ink pb-4">
		<p class="kicker">Testează-te</p>
		<h1 class="headline mt-2 text-4xl font-semibold md:text-5xl">Testele noastre</h1>
		<p class="mt-3 font-serif text-lg text-ink/70">
			Fiecare test îți dezvăluie un profil personalizat și un plan de îmbunătățire pe email.
		</p>
	</header>

	<div>
		{#each allQuizzes as quiz (quiz.slug)}
			<article class="flex flex-col gap-3 border-b border-rule py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
				<div>
					<a href="/topics/{quiz.topic}" class="kicker hover:underline">
						{(getTopic(quiz.topic)?.name ?? 'Better Life').toUpperCase()}
					</a>
					<h2 class="mt-1.5">
						<a href="/quiz/{quiz.slug}" class="headline text-2xl">{quiz.title}</a>
					</h2>
					<p class="mt-2 max-w-prose font-serif text-ink/70">{quiz.description}</p>
					<p class="meta mt-3">{quiz.questions.length} întrebări · ~2 minute</p>
				</div>
				<a
					href="/quiz/{quiz.slug}"
					class="shrink-0 self-start rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
				>
					{m.cta_start_quiz()}
				</a>
			</article>
		{/each}
	</div>
</div>
