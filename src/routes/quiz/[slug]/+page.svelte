<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();
	const quiz = $derived(data.quiz);
</script>

<Seo
	title={quiz.title}
	description={quiz.description}
/>

<div class="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
	<div class="max-w-2xl mx-auto px-4 py-16">
		<div class="text-center mb-10">
			<div class="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
				{quiz.questions.length} întrebări · ~2 minute
			</div>
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
			<p class="text-lg text-gray-600 mb-2">{quiz.description}</p>
			<p class="text-sm text-gray-500 mb-8">
				Peste 10.000 de persoane și-au descoperit deja profilul de somn
			</p>
			<a
				href="/quiz/{quiz.slug}/play"
				class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
			>
				{m.cta_start_quiz()}
			</a>
		</div>

		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Cum funcționează?</h2>
			<div class="space-y-4">
				<div class="flex gap-4">
					<div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
					<div>
						<p class="font-medium text-gray-800">Răspunzi la {quiz.questions.length} întrebări simple</p>
						<p class="text-sm text-gray-500">Durează aproximativ 2 minute</p>
					</div>
				</div>
				<div class="flex gap-4">
					<div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
					<div>
						<p class="font-medium text-gray-800">Primești profilul tău personalizat</p>
						<p class="text-sm text-gray-500">Analizăm răspunsurile și îți identificăm tiparul</p>
					</div>
				</div>
				<div class="flex gap-4">
					<div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
					<div>
						<p class="font-medium text-gray-800">Un plan gratuit de 2 săptămâni pe email</p>
						<p class="text-sm text-gray-500">Sfaturi practice adaptate profilului tău, livrate pas cu pas</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
