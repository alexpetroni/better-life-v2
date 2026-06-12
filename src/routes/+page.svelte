<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { topics } from '$lib/content/topics.js';
</script>

<Seo
	title={m.site_name()}
	description="Descoperă testele noastre personalizate și primește sfaturi practice pentru un somn mai bun, obiceiuri mai sănătoase și o viață mai împlinită."
/>

<section class="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 px-4">
	<div class="max-w-3xl mx-auto text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">Trăiește mai bine, pas cu pas</h1>
		<p class="text-xl text-brand-100 mb-8">
			Teste personalizate, sfaturi bazate pe știință și planuri adaptate profilului tău.
		</p>
		<a
			href="/quiz/somn"
			class="inline-block bg-accent-500 hover:bg-accent-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
		>
			{m.cta_start_quiz()}
		</a>
	</div>
</section>

<section class="max-w-5xl mx-auto px-4 py-16">
	<h2 class="text-2xl font-bold text-center text-gray-800 mb-10">Domeniile noastre</h2>
	<div class="grid md:grid-cols-2 gap-8">
		{#each topics as topic}
			<div class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-4 border border-gray-100">
				<div class="text-4xl">{topic.emoji}</div>
				<h3 class="text-xl font-bold text-gray-900">{topic.name}</h3>
				<p class="text-gray-600 flex-1">{topic.tagline}</p>
				{#if topic.quizSlug}
					<a
						href="/quiz/{topic.quizSlug}"
						class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors text-center"
					>
						{m.cta_start_quiz()}
					</a>
				{/if}
			</div>
		{/each}
	</div>
</section>

<section class="bg-brand-50 py-16 px-4">
	<div class="max-w-3xl mx-auto text-center">
		<h2 class="text-2xl font-bold text-gray-800 mb-10">Cum funcționează?</h2>
		<div class="grid md:grid-cols-3 gap-8">
			<div class="flex flex-col items-center gap-3">
				<div class="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">1</div>
				<h3 class="font-semibold text-gray-800">Faci testul</h3>
				<p class="text-gray-600 text-sm">Răspunzi la câteva întrebări despre stilul tău de viață.</p>
			</div>
			<div class="flex flex-col items-center gap-3">
				<div class="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">2</div>
				<h3 class="font-semibold text-gray-800">Primești profilul tău</h3>
				<p class="text-gray-600 text-sm">Analizăm răspunsurile și îți creăm un profil personalizat.</p>
			</div>
			<div class="flex flex-col items-center gap-3">
				<div class="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">3</div>
				<h3 class="font-semibold text-gray-800">Sfaturi pe email</h3>
				<p class="text-gray-600 text-sm">Primești sfaturi adaptate profilului tău direct în inbox.</p>
			</div>
		</div>
	</div>
</section>
