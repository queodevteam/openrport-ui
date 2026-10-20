<template>
	<!--    <div> -->
	<!--        <div class="accordion"> -->
	<!--            <div class="accordion-item mx-2 border-0" v-for="(item, index) in items" :key="index"> -->
	<!--                <div class="accordion-header rounded text-primary" :id="'heading-' + index"> -->
	<!--                    <button class="accordion-button p-2" :class="{ collapsed: !isActive(index)}"  data-toggle="collapse" -->
	<!--                        :data-target="'#collapse-' + index" aria-expanded="true" :aria-controls="'collapse' + index" -->
	<!--                        @click="toggle(index, item.id)"> -->
	<!--                        <span class="nav-link-icon d-md-none d-lg-inline-block"> -->
	<!--                            <IconFolder class="text-primary" /> -->
	<!--                        </span> -->
	<!--                        <slot name="title" :item="item">{{ item.title }}</slot> -->
	<!--                    </button> -->
	<!--                </div> -->

	<!--                <div :id="'collapse-' + index" class="collapse" :class="{ 'show': isActive(index) }" -->
	<!--                    :aria-labelledby="'heading-' + index" data-parent="#accordion"> -->
	<!--                    <div class="accordion-body py-2 pe-0"> -->
	<!--                        <div class="list-group list-group-flush"> -->
	<!--                            <RouterLink v-for="(device, i) in deviceList" :key="i" :to="`/dashboard/${device.id}`" class="list-group-item list-group-item-action p-0 rounded"> -->
	<!--                                    <div class="tw-mt-2 tw-flex tw-min-h-10 tw-w-full tw-max-w-full tw-flex-100 tw-cursor-pointer tw-items-center tw-overflow-hidden tw-rounded tw-border tw-border-r-[3px] tw-px-1 tw-py-1 tw-pr-2" :class="{ 'border-r-error' : device.disconnected_at !== null , 'border-r-success': device.disconnected_at === null}"> -->
	<!--                                        <IconBrandDebian color="red" /> -->
	<!--                                        {{device.name}} -->
	<!--                                    </div> -->

	<!--                            </RouterLink> -->
	<!--                        </div> -->
	<!--                    </div> -->
	<!--                </div> -->
	<!--            </div> -->
	<!--        </div> -->
	<!--    </div> -->
	<div class="absolute inset-x-0 bottom-0 top-32">
		<div
			v-for="{ item, index } in visibleItems"
			:key="item.id ?? index"
			class="mb-1 w-full"
		>
			<button
				type="button"
				class="flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-gray-800 transition-colors duration-150"
				:class="isActive(index) ? 'bg-amber-50' : 'hover:bg-amber-50/60'"
				:aria-expanded="isActive(index)"
				@click="toggle(index, item.id)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4 shrink-0 text-amber-700/70 transition-transform duration-150"
					:class="isActive(index) ? 'rotate-90' : ''"
				>
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
					<svg
						v-if="item.id === 'favorites'"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
						/>
					</svg>
					<svg
						v-else-if="isActive(index)"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
						/>
					</svg>
					<svg
						v-else
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
						/>
					</svg>
				</span>
				<span class="min-w-0 flex-1 truncate text-sm font-medium">
					{{ item.title }}
				</span>
				<span
					v-if="folderCount(item, index) != null"
					class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs tabular-nums text-amber-800"
				>
					{{ folderCount(item, index) }}
				</span>
			</button>
			<div
				v-if="isActive(index)"
				class="relative z-10 mb-2 ml-5 mt-1 border-l border-amber-200 pl-3"
			>
				<div
					class="absolute inset-0 -top-4 z-30 flex items-center justify-center bg-white/50 backdrop-blur-sm"
					style="display: none;"
				>
					<div class="flex w-full justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32px"
							height="32px"
							viewBox="0 0 24 24"
							class="icon primary-text animate-[spin_0.6s_linear_infinite]"
						>
							<path
								fill="currentColor"
								d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
								opacity=".25"
							/>
							<path
								fill="currentColor"
								d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
							>
								<animateTransform
									attributeName="transform"
									dur="0.75s"
									repeatCount="indefinite"
									type="rotate"
									values="0 12 12;360 12 12"
								/>
							</path>
						</svg>
					</div>
				</div>

				<p
					v-if="deviceList && deviceList.length === 0"
					class="px-2 py-6 text-sm text-gray-500"
				>
					No clients match.
				</p>
				<RouterLink
					v-for="device in deviceList"
					:key="device.id"
					:to="`/dashboard/${device.id}`"
					class="mt-2 flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-lg border px-3 py-2 transition-colors duration-150"
					:class="route.params.id === device.id ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
				>
					<span
						class="h-2.5 w-2.5 shrink-0 rounded-full"
						:class="device.disconnected_at ? 'bg-gray-300' : 'bg-[#90e884]'"
					/>
					<div
						class="client-icon flex w-8 shrink-0 items-center justify-center"
					>
						<ClientIcon
							:os="device.os"
							:os_family="device.os_family"
							:os_full_name="device.os_full_name"
							:os_kernel="device.os_kernel"
						/>
					</div>
					<div class="min-w-0 flex-1">
						<div class="truncate text-sm font-medium text-gray-900">
							{{ device.name }}
						</div>
						<div class="truncate text-xs text-gray-500">
							{{ device?.ipv4?.length ? device.ipv4[0] : 'No IP' }}
						</div>
						<div
							v-if="listStyle === 3 && device?.tags?.length"
							class="mt-1 flex gap-1 overflow-hidden"
						>
							<span
								v-for="tag in device.tags"
								:key="tag"
								class="truncate rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
							>{{ tag }}</span>
						</div>
					</div>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup>
import { IconBrandDebian, IconFolder } from '@tabler/icons-vue';
import ClientIcon from '~/components/device/ClientIcon.vue';

const activeIndex = ref(null);
const deviceList = ref(null);
const store = useClientStore();
const route = useRoute();
const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
	activeIndex: {
		type: Number,
		default: null,
	},
	listStyle: {
		type: Number,
		default: 1,
	},
	filter: {
		type: Object,
		default: () => ({}),
	},
	reloadToken: {
		type: Number,
		default: 0,
	},
});

const hasActiveFilter = computed(() =>
	Boolean(props.filter?.search) || (props.filter?.connectionState && props.filter.connectionState !== 'any'),
);

const searchFolderIndex = computed(() => {
	const items = props.items || [];
	const allIndex = items.findIndex(item => item?.id === 'all');
	return allIndex >= 0 ? allIndex : 0;
});

const visibleItems = computed(() => {
	const items = props.items || [];
	if (activeIndex.value !== null) {
		const item = items[activeIndex.value];
		return item ? [{ item, index: activeIndex.value }] : [];
	}
	if (hasActiveFilter.value) {
		const index = searchFolderIndex.value;
		const item = items[index];
		return item ? [{ item, index }] : [];
	}
	return items.map((item, index) => ({ item, index }));
});

const loadDevices = async (index) => {
	const item = props.items?.[index];
	if (!item) return;
	deviceList.value = await store.loadGroupList(item.id, props.filter);
};

const toggle = async (index, id) => {
	if (activeIndex.value === index) {
		activeIndex.value = null;
	}
	else {
		activeIndex.value = index;
		deviceList.value = await store.loadGroupList(id, props.filter);
	}
};

watch(() => [props.filter, props.reloadToken], async () => {
	if (hasActiveFilter.value && props.items?.length) {
		activeIndex.value = searchFolderIndex.value;
	}
	if (activeIndex.value !== null) {
		await loadDevices(activeIndex.value);
	}
}, { deep: true });

const isActive = (index) => {
	return activeIndex.value === index;
};

const folderCount = (item, index) => {
	if (isActive(index) && Array.isArray(deviceList.value)) return deviceList.value.length;
	if (item?.count == null || item.count === '') return null;
	return item.count;
};
</script>

<style scoped>
.accordion-header[aria-expanded=true] {
    background-color: #00528d !important;
}

.accordion-header:hover {
    background-color: #e2e8f0 !important;
    color: #00528d !important;
    text-decoration: none !important;
}

.border-r-error {
  border-right-color: #ef4444;
}
.border-r-success {
  border-right-color: #90e884;
}
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
