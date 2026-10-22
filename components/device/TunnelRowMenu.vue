<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<button
				type="button"
				class="z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-opacity-20 p-1 text-gray-600 transition-all duration-300 hover:bg-vtd-primary-500 hover:bg-opacity-30 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:text-gray-300"
				@click.stop
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="currentColor"
						d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2Z"
					/>
				</svg>
			</button>
		</DropdownMenuTrigger>
		<DropdownMenuContent
			align="end"
			class="z-50 min-w-44 rounded-md bg-white p-1 shadow-lg ring-1 ring-black/10 focus:outline-none dark:bg-gray-950"
		>
			<DropdownMenuSub v-if="ssh">
				<DropdownMenuSubTrigger
					class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800 focus:bg-vtd-primary-600 focus:text-white data-[state=open]:bg-vtd-primary-600 data-[state=open]:text-white dark:text-gray-100"
				>
					Copy SSH command
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent
					class="z-50 min-w-36 rounded-md bg-white p-1 shadow-lg ring-1 ring-black/10 dark:bg-gray-950"
				>
					<DropdownMenuItem
						class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800 focus:bg-vtd-primary-600 focus:text-white dark:text-gray-100"
						@click.stop="emit('copy-ssh', 'pi')"
					>
						As pi
					</DropdownMenuItem>
					<DropdownMenuItem
						class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800 focus:bg-vtd-primary-600 focus:text-white dark:text-gray-100"
						@click.stop="emit('copy-ssh', 'queo')"
					>
						As queo
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
			<DropdownMenuItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800 focus:bg-vtd-primary-600 focus:text-white dark:text-gray-100"
				@click.stop="emit('update')"
			>
				Update
			</DropdownMenuItem>
			<DropdownMenuItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800 focus:bg-vtd-primary-600 focus:text-white dark:text-gray-100"
				@click.stop="emit('delete')"
			>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>

<script setup lang="ts">
defineProps({
	ssh: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update', 'delete', 'copy-ssh']);
</script>
