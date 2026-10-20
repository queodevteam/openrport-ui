<template>
	<Teleport to="body">
		<div
			v-if="modelValue"
			class="fixed inset-0 z-[100] bg-gray-500/75 backdrop-blur transition-opacity dark:bg-slate-600/80"
		/>
		<div
			v-if="modelValue"
			class="fixed inset-0 z-[200] flex items-end justify-center overflow-y-auto p-0 transition duration-150 sm:items-center sm:p-5"
		>
			<slot />
		</div>
	</Teleport>
</template>

<script setup lang="ts">
defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>

</style>
