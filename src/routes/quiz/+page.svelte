<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { allQuizzes } from '$lib/content/quizzes/index.js';
</script>

<Seo title="Teste" description="Descoperă testele noastre personalizate și află profilul tău." />

<div class="max-w-3xl mx-auto px-4 py-16">
	<h1 class="text-3xl font-bold text-gray-900 mb-3">Testele noastre</h1>
	<p class="text-gray-600 mb-10">
		Fiecare test îți dezvăluie un profil personalizat și un plan de îmbunătățire.
	</p>

	<div class="space-y-6">
		{#each allQuizzes as quiz}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<h2 class="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
				<p class="text-gray-600 mb-4">{quiz.description}</p>
				<a
					href="/quiz/{quiz.slug}"
					class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors"
				>
					{m.cta_start_quiz()}
				</a>
			</div>
		{/each}
	</div>
</div>
