<template>
	<button
		type="button"
		:class="buttonClass"
		:title="isDark ? 'Light mode' : 'Dark mode'"
		:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
		:aria-pressed="isDark"
		@click="toggle"
	>
		<svg
			v-if="isDark"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="icon h-6 w-6"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.22 5.64a1 1 0 0 1 1.42-1.42l1.06 1.06a1 1 0 0 1-1.42 1.42L4.22 5.64Zm12.08 12.08a1 1 0 0 1 1.42-1.42l1.06 1.06a1 1 0 1 1-1.42 1.42l-1.06-1.06ZM3 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm15.5 0a1 1 0 0 1 1-1H21a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM5.64 19.78a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 1.42l-1.06 1.06Zm12.08-12.08a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 1 1 1.42 1.42l-1.06 1.06Z"
			/>
		</svg>
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="icon h-6 w-6"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M12 3a9 9 0 1 0 8.9 10.36A5.4 5.4 0 0 1 16.5 13a5.4 5.4 0 0 1-3.14-9.8A9 9 0 0 0 12 3"
			/>
		</svg>
		<span v-if="showLabel">{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
	</button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
	showLabel?: boolean;
	variant?: 'icon' | 'nav';
}>(), {
	showLabel: false,
	variant: 'icon',
});

const { isDark, toggle } = useColorMode();

const buttonClass = computed(() => {
	if (props.variant === 'nav') {
		return [
			'flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700',
			props.showLabel ? 'justify-start gap-x-3 px-3' : 'justify-center px-2',
		];
	}

	return 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-current';
});
</script>
