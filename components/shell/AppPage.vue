<template>
	<div class="app-page mx-auto flex min-h-0 w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
		<div
			v-if="$slots.title || $slots.actions"
			class="flex flex-wrap items-center justify-between gap-3"
		>
			<div class="min-w-0">
				<h1 class="text-2xl font-semibold leading-tight text-gray-900 dark:text-white">
					<slot name="title" />
				</h1>
				<p
					v-if="$slots.subtitle"
					class="mt-1 text-sm text-gray-500 dark:text-gray-400"
				>
					<slot name="subtitle" />
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<slot name="actions" />
			</div>
		</div>
		<slot />
	</div>
</template>
