<template>
	<div class="min-w-0">
		<NuxtLink
			to="/dashboard"
			class="mb-3 inline-flex min-h-11 items-center text-sm font-medium text-primary-700 xl:hidden"
		>
			Clients
		</NuxtLink>
		<div class="flex min-w-0 items-start justify-between gap-3">
			<div class="min-w-0">
				<h2 class="truncate text-2xl font-semibold text-gray-900">
					{{ device?.name || device?.hostname || '' }}
				</h2>
				<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
					<span class="inline-flex items-center gap-2 font-medium text-gray-700">
						<span
							class="h-2.5 w-2.5 rounded-full"
							:class="online ? 'bg-[#90e884]' : 'bg-gray-300'"
						/>
						{{ online ? 'Connected' : 'Offline' }}
					</span>
					<span class="text-gray-500">
						{{ device?.ipv4?.length ? device.ipv4[0] : device?.address || 'No IP' }}
					</span>
				</div>
			</div>
			<button
				v-if="offline"
				type="button"
				class="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
				@click="emit('delete')"
			>
				Delete
			</button>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	device: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(['delete']);
const online = computed(() => props.device?.disconnected_at === null);
const offline = computed(() => props.device?.disconnected_at != null && props.device.disconnected_at !== '');
</script>
