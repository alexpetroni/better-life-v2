<script lang="ts">
	const { data } = $props();
</script>

{#if !data.valid}
	<div class="max-w-xl mx-auto px-4 py-16 text-center">
		<div class="text-4xl mb-4">🔗</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-3">Linkul nu mai este valabil</h1>
		<p class="text-gray-600 mb-6">
			Linkul de rezultate a expirat sau este invalid. Retestează-te pentru a-ți vedea profilul.
		</p>
		<a
			href="/quiz/somn"
			class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
		>
			Reia testul
		</a>
	</div>
{:else}
	{@const { quiz, profile } = data}
	<div class="max-w-2xl mx-auto px-4 py-16">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Rezultatul tău</h1>
		</div>

		<div class="bg-brand-50 border border-brand-200 rounded-2xl p-8 mb-6">
			<h2 class="text-2xl font-bold text-brand-800 mb-2">{profile?.name}</h2>
			<p class="text-brand-700">{profile?.teaser}</p>
		</div>

		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
			<div class="text-3xl mb-3">📬</div>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">
				Rezultatul complet și planul tău sunt pe drum!
			</h3>
			<p class="text-gray-600">
				Verifică-ți inboxul — ți-am trimis analiza completă și planul tău personalizat de 2
				săptămâni. Confirmă adresa pentru a-l activa.
			</p>
		</div>

		{#if profile?.recommendedProductSlugs?.length}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Recomandate pentru tine</h3>
				<p class="text-gray-500 text-sm">
					Produsele recomandate vor fi disponibile în curând în magazinul nostru.
				</p>
			</div>
		{/if}

		<div class="text-center">
			<p class="text-gray-600 mb-3">Cunoști pe cineva care s-ar bucura de acest test?</p>
			<a
				href="/quiz/{quiz?.slug}"
				class="inline-block border border-brand-600 text-brand-600 hover:bg-brand-50 font-medium px-6 py-2 rounded-lg transition-colors"
			>
				Distribuie testul
			</a>
		</div>
	</div>
{/if}
