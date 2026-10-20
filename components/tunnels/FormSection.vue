<template>
	<div :class="isFirst ? '' : 'mt-6'">
		<p class="text-xs font-medium uppercase tracking-wide text-gray-400">
			{{ title }}
		</p>
		<div class="mt-2">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	number?: string | number;
	title: string;
	isFirst?: boolean;
}>();
</script>
