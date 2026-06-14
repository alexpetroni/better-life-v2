<script lang="ts">
	import type { QuizQuestion } from '$lib/quiz/types.js';

	interface Props {
		question: QuizQuestion;
		selected?: string;
		onSelect: (optionId: string) => void;
	}

	const { question, selected, onSelect }: Props = $props();
</script>

<div class="space-y-3">
	<h2 class="mb-6 font-serif text-2xl font-semibold leading-tight text-ink">{question.text}</h2>
	{#each question.options as option}
		<button
			data-testid="quiz-option"
			onclick={() => onSelect(option.id)}
			class="block w-full border p-4 text-left font-serif text-lg transition-colors duration-150 {selected ===
			option.id
				? 'border-brand-600 bg-brand-50 text-brand-900'
				: 'border-rule text-ink hover:border-ink'}"
		>
			{option.label}
		</button>
	{/each}
</div>
