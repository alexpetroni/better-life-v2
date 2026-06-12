<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	const { current, total }: Props = $props();
	const pct = $derived(Math.round((current / total) * 100));
</script>

<div class="w-full bg-gray-200 rounded-full h-2">
	<div
		class="bg-brand-600 h-2 rounded-full transition-all duration-300"
		style="width: {pct}%"
	></div>
</div>
<p class="text-xs text-gray-500 mt-1 text-right">{current} / {total}</p>
