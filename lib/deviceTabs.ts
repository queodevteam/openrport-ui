import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';
import type { Permissions } from '~/types';
import DeviceAuditTab from '~/components/device/DeviceAuditTab.vue';
import DeviceCommandsTab from '~/components/device/DeviceCommandsTab.vue';
import DeviceDocumentsTab from '~/components/device/DeviceDocumentsTab.vue';
import DeviceFilesTab from '~/components/device/DeviceFilesTab.vue';
import DeviceInventoryTab from '~/components/device/DeviceInventoryTab.vue';
import DeviceMetaDataTab from '~/components/device/DeviceMetaDataTab.vue';
import DeviceScriptsTab from '~/components/device/DeviceScriptsTab.vue';
import DeviceTunnelsTab from '~/components/device/DeviceTunnelsTab.vue';
import SchedulesTab from '~/components/device/SchedulesTab.vue';

export interface DeviceTab {
	id: string;
	label: string;
	permission: keyof Permissions | null;
}

export const deviceTabCatalog: DeviceTab[] = [
	{ id: 'inventory', label: 'Inventory', permission: null },
	{ id: 'tunnels', label: 'Tunnels', permission: 'tunnels' },
	{ id: 'meta-data', label: 'Meta-Data', permission: null },
	{ id: 'documents', label: 'Documents', permission: null },
	{ id: 'commands', label: 'Commands', permission: 'commands' },
	{ id: 'scripts', label: 'Scripts', permission: 'scripts' },
	{ id: 'monitoring', label: 'Monitoring', permission: 'monitoring' },
	{ id: 'files', label: 'Files', permission: 'uploads' },
	{ id: 'audit', label: 'Audit', permission: 'auditlog' },
	{ id: 'schedules', label: 'Schedules', permission: 'scheduler' },
];

export function isMonitoringEnabled(value: unknown): boolean {
	return value === true;
}

export function configurableDeviceTabs(monitoringEnabled: boolean): DeviceTab[] {
	return deviceTabCatalog.filter(tab => tab.id !== 'monitoring' || monitoringEnabled);
}

export function visibleDeviceTabs(options: {
	monitoringEnabled: boolean;
	permissions?: Partial<Permissions> | null;
	deviceTabs?: Record<string, boolean> | null;
}): DeviceTab[] {
	const tabs = deviceTabCatalog.filter((tab) => {
		if (tab.id === 'monitoring' && !options.monitoringEnabled) {
			return false;
		}
		if (options.deviceTabs && options.deviceTabs[tab.id] === false) {
			return false;
		}
		if (tab.permission && options.permissions && options.permissions[tab.permission] === false) {
			return false;
		}
		return true;
	});

	if (!tabs.length) {
		return deviceTabCatalog.filter(tab => tab.id === 'inventory');
	}
	return tabs;
}

export function deviceTabComponents(monitoringEnabled: boolean): Record<string, Component> {
	const components: Record<string, Component> = {
		inventory: DeviceInventoryTab,
		tunnels: DeviceTunnelsTab,
		'meta-data': DeviceMetaDataTab,
		documents: DeviceDocumentsTab,
		commands: DeviceCommandsTab,
		scripts: DeviceScriptsTab,
		files: DeviceFilesTab,
		audit: DeviceAuditTab,
		schedules: SchedulesTab,
	};

	if (monitoringEnabled) {
		components.monitoring = defineAsyncComponent(() => import('~/components/device/DeviceMonitoringTab.vue'));
	}

	return components;
}
