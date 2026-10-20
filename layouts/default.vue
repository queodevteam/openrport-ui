<template>
	<div class="flex h-full overflow-hidden">
		<NewSidebar />
		<div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
			<header class="z-30 flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 lg:hidden dark:border-gray-700 dark:bg-gray-900">
				<button
					type="button"
					class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-gray-700"
					aria-label="Open menu"
					@click="openMobileNav"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"
						/>
					</svg>
				</button>
				<span class="text-sm font-semibold text-gray-900 dark:text-white">OpenRport</span>
			</header>
			<div class="min-h-0 flex-1 overflow-hidden">
				<slot />
			</div>
		</div>
		<NuxtSnackbar />
	</div>
</template>

<script setup lang="ts">
const profileStore = useProfile();
const { openMobileNav } = useAppShell();

onMounted(() => {
	profileStore.fetchProfile();
});
</script>
