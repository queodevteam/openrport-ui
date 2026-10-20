<template>
	<div class="min-h-0 flex-1 overflow-y-auto">
		<AppPage>
			<device-header :device="device" />
			<TunnelsTunnelForm
				v-if="isAddingTunnel"
				:device="device"
			/>
			<Tabs
				v-else
				v-model="selectedTab"
				class="flex min-h-0 flex-1 flex-col"
			>
				<div class="relative border-b border-gray-200 dark:border-gray-700">
					<TabsList class="h-auto w-full justify-start bg-transparent p-0">
						<ul
							class="flex w-full snap-x gap-1 overflow-x-auto overscroll-x-contain"
						>
							<TabsTrigger
								v-for="tab in visibleTabs"
								:key="tab.id"
								as="li"
								:value="tab.id"
								class="min-h-11 shrink-0 cursor-pointer snap-start whitespace-nowrap border-b-[3px] border-transparent"
							>
								<span class="flex min-h-11 items-center px-4 text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-primary-700 data-[state=active]:text-primary-800">
									{{ tab.label }}
								</span>
							</TabsTrigger>
						</ul>
					</TabsList>
				</div>
				<div class="min-w-0 py-4">
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
		</AppPage>
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
const selectedTab = ref('inventory');
const { isAddingTunnel } = storeToRefs(tunnelStore);
const { device, metrics } = useClientDetail();
const { monitoringEnabled, visibleTabs } = useDeviceTabs();
const tabComponents = deviceTabComponents(monitoringEnabled.value);

const propsFor = (id: string) => {
	if (id === 'inventory') {
		return { device: device.value, metrics: metrics.value };
	}
	if (id === 'tunnels' || id === 'commands' || id === 'scripts') {
		return { id: device.value?.id };
	}
	return {};
};

watch(visibleTabs, (tabs) => {
	if (!tabs.some(tab => tab.id === selectedTab.value)) {
		selectedTab.value = tabs[0]?.id || 'inventory';
	}
}, { immediate: true });

onMounted(() => {
	profileStore.fetchProfile();
});
</script>
