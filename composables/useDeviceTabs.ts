import { configurableDeviceTabs, isMonitoringEnabled, visibleDeviceTabs } from '~/lib/deviceTabs';

export function useDeviceTabs() {
	const config = useRuntimeConfig();
	const profileStore = useProfile();
	const monitoringEnabled = computed(() => isMonitoringEnabled(config.public.monitoringEnabled));

	const configurableTabs = computed(() => configurableDeviceTabs(monitoringEnabled.value));
	const visibleTabs = computed(() => visibleDeviceTabs({
		monitoringEnabled: monitoringEnabled.value,
		permissions: profileStore.profile?.effective_user_permissions,
		deviceTabs: profileStore.profile?.effective_device_tabs,
	}));

	return {
		monitoringEnabled,
		configurableTabs,
		visibleTabs,
	};
}
