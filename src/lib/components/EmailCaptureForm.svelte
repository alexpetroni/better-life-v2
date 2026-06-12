<script lang="ts">
	interface Props {
		quizSlug: string;
		answers: Record<string, string>;
		onSuccess: (resultToken: string | null) => void;
	}

	const { quizSlug, answers, onSuccess }: Props = $props();

	let email = $state('');
	let website = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/quiz/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quizSlug, answers, email, website })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({ error: 'Eroare de server' }));
				error = data.error ?? 'A apărut o eroare. Te rugăm să încerci din nou.';
				return;
			}

			const data = await res.json();
			onSuccess(data.resultToken);
		} catch {
			error = 'Nu am putut trimite formularul. Verifică conexiunea și încearcă din nou.';
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<div>
		<p class="text-lg font-semibold text-gray-900 mb-2">Unde îți trimitem rezultatul?</p>
		<p class="text-gray-600 text-sm mb-4">
			Îți trimitem rezultatul complet și sfaturi personalizate pe email. Planul tău gratuit de 2
			săptămâni pornește de la confirmare.
		</p>
	</div>

	<div>
		<label for="email-input" class="block text-sm font-medium text-gray-700 mb-1">
			Adresa de email
		</label>
		<input
			id="email-input"
			type="email"
			bind:value={email}
			placeholder="adresa@exemplu.ro"
			required
			class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
		/>
	</div>

	<!-- Honeypot field - hidden from real users -->
	<div style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">
		<label for="website-field">Website</label>
		<input
			id="website-field"
			type="text"
			name="website"
			bind:value={website}
			tabindex="-1"
			autocomplete="off"
		/>
	</div>

	{#if error}
		<p class="text-red-600 text-sm">{error}</p>
	{/if}

	<p class="text-xs text-gray-500">
		Prin trimiterea adresei, ești de acord cu
		<a href="/privacy" class="text-brand-600 hover:underline">politica noastră de confidențialitate</a>.
		Poți dezabona oricând cu un singur click.
	</p>

	<button
		type="submit"
		disabled={loading}
		class="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
	>
		{loading ? 'Se trimite...' : 'Trimite rezultatele pe email'}
	</button>
</form>
