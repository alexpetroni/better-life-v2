<script lang="ts">
	import { getTopic } from '$lib/content/topics.js';

	interface Props {
		topic?: string;
		variant?: 'photo' | 'art';
		ratio?: string;
		class?: string;
	}

	const { topic, variant = 'photo', ratio = '4 / 3', class: cls = '' }: Props = $props();

	// Posts carry no images yet — stand in with a tinted editorial block bearing a
	// faint serif monogram of the section, so the grid reads like a magazine.
	const initial = $derived(
		((getTopic(topic ?? '')?.name ?? 'Better Life').replace(/^Better\s+/, '').charAt(0) || 'B').toUpperCase()
	);
</script>

<div
	class="relative overflow-hidden {variant === 'art' ? 'bg-paper' : 'bg-photo'} {cls}"
	style="aspect-ratio: {ratio};"
>
	<span
		class="absolute inset-0 flex items-center justify-center font-serif font-semibold leading-none select-none {variant ===
		'art'
			? 'text-brand-600/20'
			: 'text-black/10'}"
		style="font-size: 42%;"
	>
		{initial}
	</span>
	{#if variant === 'art'}
		<span class="absolute inset-3 border border-brand-600/15"></span>
	{/if}
</div>
