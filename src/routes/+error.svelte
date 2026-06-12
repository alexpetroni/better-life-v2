<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="max-w-2xl mx-auto px-4 py-24 text-center">
	{#if page.status === 404}
		<h1 class="text-4xl font-bold text-gray-900 mb-4">Pagina nu există</h1>
		<p class="text-gray-600 mb-8">Ne pare rău, dar pagina pe care o cauți nu a putut fi găsită.</p>
	{:else}
		<h1 class="text-4xl font-bold text-gray-900 mb-4">A apărut o eroare</h1>
		<p class="text-gray-600 mb-8">
			Eroare {page.status}: {page.error?.message ?? 'Ceva nu a mers bine.'}
		</p>
	{/if}
	<a href="/" class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors">
		Înapoi acasă
	</a>
</div>
