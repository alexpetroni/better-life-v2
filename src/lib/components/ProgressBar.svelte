<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	const { current, total }: Props = $props();
	const pct = $derived(Math.round((current / total) * 100));
</script>

<div class="h-1 w-full bg-rule">
	<div class="h-1 bg-brand-600 transition-all duration-300" style="width: {pct}%"></div>
</div>
<p class="meta mt-2 text-right">Întrebarea {current} / {total}</p>
