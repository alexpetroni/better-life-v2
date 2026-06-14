<script lang="ts">
	import { goto } from '$app/navigation';
	import { track } from '@vercel/analytics';
	import EmailCaptureForm from '$lib/components/EmailCaptureForm.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import QuizQuestion from '$lib/components/QuizQuestion.svelte';

	const { data } = $props();
	const quiz = $derived(data.quiz);

	let current = $state(0);
	let answers = $state<Record<string, string>>({});
	let submitted = $state(false);

	const currentQuestion = $derived(quiz.questions[current]);
	const isLastQuestion = $derived(current === quiz.questions.length - 1);

	function selectOption(optionId: string) {
		answers = { ...answers, [currentQuestion.id]: optionId };
		if (!isLastQuestion) {
			current += 1;
		}
	}

	function goBack() {
		if (current > 0) current -= 1;
	}

	function selectOptionWithTracking(optionId: string) {
		if (current === 0) track('quiz_started', { quiz: quiz.slug });
		selectOption(optionId);
	}

	async function handleEmailSuccess(resultToken: string | null) {
		submitted = true;
		track('quiz_completed', { quiz: quiz.slug });
		if (resultToken) {
			track('email_submitted', { quiz: quiz.slug });
			await goto(`/quiz/${quiz.slug}/results?t=${resultToken}`);
		}
	}
</script>

<div class="mx-auto max-w-xl px-6 py-12">
	{#if current < quiz.questions.length}
		<div class="mb-10">
			<ProgressBar current={current + 1} total={quiz.questions.length} />
		</div>

		<QuizQuestion
			question={currentQuestion}
			selected={answers[currentQuestion.id]}
			onSelect={selectOptionWithTracking}
		/>

		{#if current > 0}
			<button onclick={goBack} class="meta mt-6 hover:text-brand-700">← Înapoi</button>
		{/if}

		{#if isLastQuestion && answers[currentQuestion.id]}
			<button
				onclick={() => {
					current = quiz.questions.length;
				}}
				class="mt-8 w-full rounded-sm bg-brand-600 px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-brand-700"
			>
				Continuă →
			</button>
		{/if}
	{:else if submitted}
		<div class="border-y-2 border-ink py-12 text-center">
			<p class="kicker">Gata</p>
			<h2 class="headline mt-3 text-3xl font-semibold">Verifică-ți inboxul</h2>
			<p class="mx-auto mt-3 max-w-sm font-serif text-ink/70">
				Ți-am trimis rezultatele și profilul tău pe email. Verifică și folderul Spam dacă nu apare în
				câteva minute.
			</p>
		</div>
	{:else}
		<EmailCaptureForm quizSlug={quiz.slug} {answers} onSuccess={handleEmailSuccess} />
	{/if}
</div>
