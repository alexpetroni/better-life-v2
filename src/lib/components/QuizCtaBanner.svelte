<script lang="ts">
	import { getQuiz } from '$lib/content/quizzes/index.js';

	interface Props {
		quizSlug: string;
	}

	const { quizSlug }: Props = $props();

	const quiz = $derived(getQuiz(quizSlug));
</script>

{#if quiz}
	<div class="rounded-xl bg-brand-50 border border-brand-200 p-6">
		<p class="mb-3 text-brand-800 font-medium">
			Vrei un plan personalizat? Fă testul de {quiz.topic} →
		</p>
		<a
			href="/quiz/{quizSlug}"
			class="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
		>
			Începe testul gratuit
		</a>
	</div>
{/if}
