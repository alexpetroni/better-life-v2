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

<form onsubmit={handleSubmit}>
	<p class="kicker">Aproape gata</p>
	<p class="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
		Unde îți trimitem rezultatul?
	</p>
	<p class="mt-3 font-serif text-ink/70">
		Îți trimitem rezultatul complet și sfaturi personalizate pe email. Planul tău gratuit de 2
		săptămâni pornește de la confirmare.
	</p>

	<div class="mt-6">
		<label for="email-input" class="meta mb-2 block !text-ink">Adresa de email</label>
		<input
			id="email-input"
			type="email"
			bind:value={email}
			placeholder="adresa@exemplu.ro"
			required
			class="w-full border border-rule bg-white px-4 py-3 font-serif text-lg text-ink focus:border-ink focus:outline-none"
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
		<p class="mt-4 font-serif text-brand-700">{error}</p>
	{/if}

	<button
		type="submit"
		disabled={loading}
		class="mt-5 w-full rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
	>
		{loading ? 'Se trimite…' : 'Trimite rezultatele pe email'}
	</button>

	<p class="mt-4 font-serif text-sm text-ink/55">
		Prin trimiterea adresei, ești de acord cu
		<a href="/privacy" class="text-brand-700 underline">politica de confidențialitate</a>. Poți
		dezabona oricând cu un singur click.
	</p>
</form>
