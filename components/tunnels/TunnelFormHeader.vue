<template>
	<div class="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
		<div class="flex min-w-0 items-center gap-2.5">
			<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
					<path fill="currentColor" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3v2h1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h1v-2H6a2 2 0 0 1-2-2zm8 10v2h.01V16zM6 6v8h12V6z" />
				</svg>
			</span>
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Add tunnel
			</h3>
		</div>
		<button
			type="button"
			class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700"
			@click="handleCancel"
		>
			Cancel
		</button>
	</div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
	cancel: [];
}>();
const handleCancel = () => {
	emits('cancel');
};
</script>

<style scoped>

</style>
