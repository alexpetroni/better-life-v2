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

	const progress = $derived(Math.round((current / quiz.questions.length) * 100));
	const currentQuestion = $derived(quiz.questions[current]);
	const isLastQuestion = $derived(current === quiz.questions.length - 1);
	const allAnswered = $derived(quiz.questions.every((q) => answers[q.id]));

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

<div class="min-h-screen bg-gray-50">
	<div class="max-w-xl mx-auto px-4 py-10">
		{#if current < quiz.questions.length}
			<div class="mb-8">
				<ProgressBar current={current + 1} total={quiz.questions.length} />
			</div>

			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<QuizQuestion
					question={currentQuestion}
					selected={answers[currentQuestion.id]}
					onSelect={selectOptionWithTracking}
				/>

				{#if current > 0}
					<button
						onclick={goBack}
						class="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
					>
						← Înapoi
					</button>
				{/if}

				{#if isLastQuestion && answers[currentQuestion.id]}
					<div class="mt-6">
						<button
							onclick={() => { current = quiz.questions.length; }}
							class="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Continuă →
						</button>
					</div>
				{/if}
			</div>
		{:else if submitted}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
				<div class="text-4xl mb-4">✉️</div>
				<h2 class="text-xl font-bold text-gray-900 mb-2">Verifică-ți inboxul!</h2>
				<p class="text-gray-600">
					Ți-am trimis rezultatele și profilul tău pe email. Verifică și folderul Spam dacă nu apare
					în câteva minute.
				</p>
			</div>
		{:else}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
				<EmailCaptureForm
					quizSlug={quiz.slug}
					{answers}
					onSuccess={handleEmailSuccess}
				/>
			</div>
		{/if}
	</div>
</div>
