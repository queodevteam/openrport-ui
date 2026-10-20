import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';
import type { Permissions } from '~/types';
import DeviceCommandsTab from '~/components/device/DeviceCommandsTab.vue';
import DeviceInventoryTab from '~/components/device/DeviceInventoryTab.vue';
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

const disabledTabIds = new Set(['meta-data', 'documents', 'files', 'audit']);

export function isMonitoringEnabled(value: unknown): boolean {
	return value === true;
}

export function isDeviceTabOffered(id: string, monitoringEnabled: boolean): boolean {
	if (disabledTabIds.has(id)) {
		return false;
	}
	if (id === 'monitoring') {
		return monitoringEnabled;
	}
	return true;
}

export function configurableDeviceTabs(monitoringEnabled: boolean): DeviceTab[] {
	return deviceTabCatalog.filter(tab => isDeviceTabOffered(tab.id, monitoringEnabled));
}

export function visibleDeviceTabs(options: {
	monitoringEnabled: boolean;
	permissions?: Partial<Permissions> | null;
	deviceTabs?: Record<string, boolean> | null;
}): DeviceTab[] {
	const tabs = deviceTabCatalog.filter((tab) => {
		if (!isDeviceTabOffered(tab.id, options.monitoringEnabled)) {
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
		commands: DeviceCommandsTab,
		scripts: DeviceScriptsTab,
		schedules: SchedulesTab,
	};

	if (monitoringEnabled) {
		components.monitoring = defineAsyncComponent(() => import('~/components/device/DeviceMonitoringTab.vue'));
	}

	return components;
}
