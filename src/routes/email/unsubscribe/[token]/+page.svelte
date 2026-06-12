<script lang="ts">
	const { data } = $props();
</script>

<div class="max-w-xl mx-auto px-4 py-16 text-center">
	{#if data.success}
		<div class="text-4xl mb-4">👋</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-3">Te-ai dezabonat</h1>
		<p class="text-gray-600 mb-6">
			Ne pare rău să te vedem plecând. Nu vei mai primi emailuri de la noi.
		</p>
		<p class="text-gray-500 text-sm mb-8">
			Dacă te-ai răzgândit, poți oricând să retestezi și să te reabonezi.
		</p>
		<a
			href="/quiz/somn"
			class="inline-block border border-brand-600 text-brand-600 hover:bg-brand-50 font-medium px-6 py-2 rounded-lg transition-colors"
		>
			Retestează-te
		</a>
	{:else}
		<div class="text-4xl mb-4">❌</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-3">Link invalid</h1>
		<p class="text-gray-600 mb-6">Linkul de dezabonare este invalid sau a expirat.</p>
		<a href="/" class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors">
			Înapoi acasă
		</a>
	{/if}
</div>
