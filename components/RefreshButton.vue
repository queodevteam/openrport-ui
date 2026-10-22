<template>
	<button
		type="button"
		class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
		:disabled="pending"
		:aria-busy="pending"
		@click="emit('refresh')"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			aria-hidden="true"
			:class="pending ? 'animate-spin' : ''"
		>
			<path
				fill="currentColor"
				d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
			/>
		</svg>
		<span>{{ pending ? 'Refreshing…' : 'Refresh' }}</span>
	</button>
</template>

<script setup lang="ts">
defineProps<{
	pending?: boolean;
}>();

const emit = defineEmits<{
	refresh: [];
}>();
</script>
