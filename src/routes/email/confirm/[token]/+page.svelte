<script lang="ts">
	const { data } = $props();
</script>

<div class="max-w-xl mx-auto px-4 py-16 text-center">
	{#if data.success}
		<div class="text-4xl mb-4">✅</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-3">
			{data.alreadyConfirmed ? 'Adresa ta este deja confirmată!' : 'Mulțumim! Adresa ta este confirmată'}
		</h1>
		<p class="text-gray-600">
			{data.alreadyConfirmed
				? 'Vei continua să primești planul tău personalizat pe email.'
				: 'Primul email din plan sosește în curând. Verifică-ți inboxul!'}
		</p>
	{:else}
		<div class="text-4xl mb-4">❌</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-3">Link invalid</h1>
		<p class="text-gray-600 mb-6">{data.message}</p>
		<a href="/" class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors">
			Înapoi acasă
		</a>
	{/if}
</div>
