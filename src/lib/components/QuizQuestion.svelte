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
	<h2 class="text-xl font-semibold text-gray-900 mb-6">{question.text}</h2>
	{#each question.options as option}
		<button
			data-testid="quiz-option"
			onclick={() => onSelect(option.id)}
			class="w-full text-left p-4 rounded-xl border-2 transition-all duration-150 {selected === option.id
				? 'border-brand-600 bg-brand-50 text-brand-800 font-medium'
				: 'border-gray-200 hover:border-brand-300 hover:bg-gray-50 text-gray-700'}"
		>
			{option.label}
		</button>
	{/each}
</div>
