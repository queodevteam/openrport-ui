<template>
	<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden px-6 pt-4 sm:px-10 sm:pt-6">
		<device-header
			:device="device"
			class="shrink-0"
			@delete="confirmDelete = true"
		/>
		<div
			v-if="isAddingTunnel"
			class="scrollbar-hide mt-4 min-h-0 flex-1 overflow-y-auto pb-6"
		>
			<TunnelsTunnelForm :device="device" />
		</div>
		<Tabs
			v-else
			v-model="selectedTab"
			class="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden"
		>
			<div class="relative shrink-0 border-b border-gray-200 dark:border-gray-700">
				<TabsList class="h-auto w-full justify-start bg-transparent p-0">
					<ul
						class="flex w-full snap-x gap-1 overflow-x-auto overscroll-x-contain"
					>
						<TabsTrigger
							v-for="tab in visibleTabs"
							:key="tab.id"
							as="li"
							:value="tab.id"
							:disabled="tabLocked(tab.id)"
							:title="tabLocked(tab.id) ? 'Available when the device is connected' : undefined"
							class="min-h-11 shrink-0 snap-start whitespace-nowrap border-b-[3px] border-transparent disabled:cursor-not-allowed disabled:opacity-40"
							:class="tabLocked(tab.id) ? 'cursor-not-allowed' : 'cursor-pointer'"
						>
							<span
								class="flex min-h-11 items-center px-4 text-sm font-medium text-gray-600 transition-colors duration-150 data-[state=active]:text-primary-800"
								:class="tabLocked(tab.id) ? '' : 'hover:text-primary-700'"
							>
								{{ tab.label }}
							</span>
						</TabsTrigger>
					</ul>
				</TabsList>
			</div>
			<div class="scrollbar-hide min-h-0 flex-1 overflow-y-auto py-4">
				<TabsContent
					v-for="tab in visibleTabs"
					:key="tab.id"
					:value="tab.id"
				>
					<component
						:is="tabComponents[tab.id]"
						v-bind="propsFor(tab.id)"
						@addtunnel="tunnelStore.openAddTunel()"
					/>
				</TabsContent>
			</div>
		</Tabs>
		<Modal
			v-model="confirmDelete"
			title="Delete device"
			ok-text="Delete"
			cancel-text="Cancel"
			:show-cancel="true"
			@ok="deleteDevice"
		>
			<div class="flex min-h-[200px] items-center justify-center p-6 text-center text-sm text-gray-700">
				Delete {{ device?.name || device?.hostname || device?.id }}? This removes the disconnected device from the server.
			</div>
		</Modal>
	</div>
</template>

<script lang="ts" setup>
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';
import { deviceTabComponents } from '~/lib/deviceTabs';
import { useClientDetail } from '~/composables/useClientDetail';

const tunnelStore = useTunnelStore();
const profileStore = useProfile();
const clientStore = useClientStore();
const snackbar = useSnackbar();
const router = useRouter();
const { $api } = useNuxtApp();
const confirmDelete = ref(false);
const deleting = ref(false);
const selectedTab = ref('inventory');
const { isAddingTunnel } = storeToRefs(tunnelStore);
const { device, metrics } = useClientDetail();
const { monitoringEnabled, visibleTabs } = useDeviceTabs();
const tabComponents = deviceTabComponents(monitoringEnabled.value);
const offline = computed(() => device.value?.disconnected_at != null && device.value.disconnected_at !== '');
const tabLocked = (id: string) => offline.value && id !== 'inventory';

const propsFor = (id: string) => {
	if (id === 'inventory') {
		return { device: device.value, metrics: metrics.value };
	}
	if (id === 'tunnels' || id === 'commands' || id === 'scripts') {
		return { id: device.value?.id };
	}
	return {};
};

watch([offline, visibleTabs], () => {
	if (offline.value) {
		selectedTab.value = 'inventory';
		if (isAddingTunnel.value) tunnelStore.closeAddTunnel();
		return;
	}
	if (!visibleTabs.value.some(tab => tab.id === selectedTab.value)) {
		selectedTab.value = visibleTabs.value[0]?.id || 'inventory';
	}
}, { immediate: true });

const deleteDevice = async () => {
	const id = device.value?.id;
	if (!id || deleting.value) return;
	deleting.value = true;
	try {
		await $api.clients.delete(id);
		confirmDelete.value = false;
		await router.push('/dashboard');
		await clientStore.dropClient(id);
		snackbar.add({
			type: 'success',
			text: 'Device deleted',
		});
	}
	catch (error) {
		snackbar.add({
			type: 'error',
			text: 'Could not delete the device',
		});
	}
	finally {
		deleting.value = false;
	}
};

onMounted(() => {
	profileStore.fetchProfile();
});
</script>
