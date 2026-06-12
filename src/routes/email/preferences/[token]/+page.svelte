<script lang="ts">
	import { enhance } from '$app/forms';

	const { data, form } = $props();
</script>

<div class="max-w-xl mx-auto px-4 py-16">
	{#if !data.valid}
		<div class="text-center">
			<div class="text-4xl mb-4">❌</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-3">Link invalid</h1>
			<p class="text-gray-600 mb-6">Linkul de preferințe este invalid sau a expirat.</p>
			<a href="/" class="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2 rounded-lg transition-colors">
				Înapoi acasă
			</a>
		</div>
	{:else}
		<h1 class="text-2xl font-bold text-gray-900 mb-6">Preferințe email</h1>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
				Preferințele au fost salvate cu succes!
			</div>
		{/if}

		<form method="POST" use:enhance class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<p class="text-gray-600 mb-4">Cât de des vrei să primești emailuri de la noi?</p>

			<div class="space-y-3 mb-6">
				{#each [['weekly', 'Săptămânal'], ['monthly', 'Lunar'], ['none', 'Deloc']] as [value, label]}
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="radio"
							name="cadence"
							{value}
							checked={data.subscriber?.cadence === value}
							class="w-4 h-4 text-brand-600"
						/>
						<span class="text-gray-800">{label}</span>
					</label>
				{/each}
			</div>

			<button
				type="submit"
				class="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
			>
				Salvează preferințele
			</button>
		</form>
	{/if}
</div>
