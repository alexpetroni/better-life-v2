<script lang="ts">
	import { getQuiz } from '$lib/content/quizzes/index.js';

	interface Props {
		quizSlug: string;
	}

	const { quizSlug }: Props = $props();
	const quiz = $derived(getQuiz(quizSlug));
</script>

{#if quiz}
	<div class="my-12 border-y-2 border-ink py-8 text-center">
		<p class="kicker">Testează-te</p>
		<p class="mx-auto mt-2 max-w-xl font-serif text-2xl font-semibold leading-snug">
			Vrei un plan personalizat? Fă testul de {quiz.topic}.
		</p>
		<a
			href="/quiz/{quizSlug}"
			class="mt-5 inline-block rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
		>
			Începe testul gratuit
		</a>
	</div>
{/if}
