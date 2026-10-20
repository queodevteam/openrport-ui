<template>
	<AppCard>
		<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
			<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
					<path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1m12 8H5v9h14zm-9 2h2v2H10zm4 0h2v2h-2z" />
				</svg>
			</span>
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Schedules
			</h3>
		</div>
		<p class="px-3 py-8 text-center text-sm text-gray-500">
			No schedules for this device.
		</p>
	</AppCard>
</template>

<script setup lang="ts">
defineProps({
	device: {
		type: Object,
		default: null,
	},
});
</script>
