<template>
	<div class="mt-2 grid grid-cols-1 gap-3 pb-4 xl:grid-cols-2">
		<AppCard class="relative xl:col-span-2">
			<button
				type="button"
				class="absolute right-2 top-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-primary-800"
				@click="tagsOpen = true"
			>
				Edit
			</button>
			<div class="px-3 py-2.5 pr-14">
				<p class="mb-1 text-xs font-medium text-gray-400">
					Tags
				</p>
				<div
					v-if="device?.tags?.length"
					class="flex flex-wrap gap-1"
				>
					<span
						v-for="tag in device.tags"
						:key="tag"
						class="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-inset ring-amber-200"
					>{{ tag }}</span>
				</div>
				<p
					v-else
					class="text-xs text-gray-400"
				>
					None
				</p>
			</div>
		</AppCard>
		<AppCard>
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M12 1.6c1.8.3 2.8 2 2.2 3.6-1.3-.3-2.3-1.4-2.2-2.8-.1 1.4-.9 2.5-2.2 2.8C9.2 3.6 10.2 1.9 12 1.6"
						/>
						<circle cx="8.5" cy="9.4" r="2.05" fill="currentColor" />
						<circle cx="12" cy="8.2" r="2.05" fill="currentColor" />
						<circle cx="15.5" cy="9.4" r="2.05" fill="currentColor" />
						<circle cx="9.6" cy="12.8" r="2.05" fill="currentColor" />
						<circle cx="14.2" cy="12.8" r="2.05" fill="currentColor" />
						<circle cx="12" cy="16.1" r="2.05" fill="currentColor" />
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Device
				</h3>
			</div>
			<dl class="divide-y divide-gray-100 dark:divide-gray-800">
				<div
					v-for="row in identityRows"
					:key="row.label"
					class="flex items-start justify-between gap-3 px-3 py-2"
				>
					<div class="min-w-0">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
							{{ row.label }}
						</dt>
						<dd class="mt-1 break-all font-mono text-sm text-gray-900 dark:text-gray-100">
							{{ row.value }}
						</dd>
					</div>
					<button
						v-if="row.copy"
						type="button"
						class="inline-flex shrink-0 items-center rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-primary-800"
						@click="copy(row.value)"
					>
						Copy
					</button>
				</div>
			</dl>
		</AppCard>

		<AppCard>
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m7.93 9h-3.18a15.7 15.7 0 0 0-1.2-5.02A8.03 8.03 0 0 1 19.93 11M12 4.07c.83 1.2 1.48 2.97 1.83 4.93h-3.66c.35-1.96 1-3.73 1.83-4.93M4.07 13h3.18c.24 1.8.7 3.5 1.2 5.02A8.03 8.03 0 0 1 4.07 13m3.18-2H4.07a8.03 8.03 0 0 1 4.38-5.02A15.7 15.7 0 0 0 7.25 11M12 19.93c-.83-1.2-1.48-2.97-1.83-4.93h3.66c-.35 1.96-1 3.73-1.83 4.93M14.75 13h-5.5a13.8 13.8 0 0 1 0-2h5.5a13.8 13.8 0 0 1 0 2m.57 5.02c.5-1.52.96-3.22 1.2-5.02h3.18a8.03 8.03 0 0 1-4.38 5.02"
						/>
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Network
				</h3>
			</div>
			<div class="space-y-3 px-3 py-3">
				<div
					v-if="device?.address"
					class="rounded-lg border border-sky-100 bg-sky-50 px-2.5 py-2"
				>
					<p class="text-xs font-medium uppercase tracking-wide text-sky-700">
						Seen by server
					</p>
					<p class="mt-1 break-all font-mono text-sm font-medium text-gray-900">
						{{ device.address }}
					</p>
				</div>
				<div>
					<p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
						IPv4
					</p>
					<p
						v-if="!device?.ipv4?.length"
						class="text-sm text-gray-500"
					>
						No IP
					</p>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="ip in device?.ipv4"
							:key="ip"
							class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs text-gray-800"
						>
							<span class="h-2 w-2 rounded-full bg-[#90e884]" />
							{{ ip }}
						</span>
					</div>
				</div>
				<div v-if="device?.ipv6?.length">
					<p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
						IPv6
					</p>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="ip in device.ipv6"
							:key="ip"
							class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs text-gray-800"
						>
							<span class="h-2 w-2 rounded-full bg-sky-400" />
							{{ ip }}
						</span>
					</div>
				</div>
			</div>
		</AppCard>

		<AppCard>
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5l1.5 2.5h-7L9 17H6a2 2 0 0 1-2-2zm2 0v10h12V5z"
						/>
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					System
				</h3>
			</div>
			<dl class="divide-y divide-gray-100 dark:divide-gray-800">
				<div
					v-for="row in systemRows"
					:key="row.label"
					class="px-3 py-2"
				>
					<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
						{{ row.label }}
					</dt>
					<dd class="mt-1 break-words text-sm text-gray-900 dark:text-gray-100">
						{{ row.value }}
					</dd>
				</div>
			</dl>
		</AppCard>

		<AppCard>
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							fill="currentColor"
							d="M6 4h12a2 2 0 0 1 2 2v3H4V6a2 2 0 0 1 2-2m-2 7h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm4 3v2h3v-2z"
						/>
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Resources
				</h3>
			</div>
			<dl class="divide-y divide-gray-100 dark:divide-gray-800">
				<div
					v-for="row in resourceRows"
					:key="row.label"
					class="px-3 py-2"
				>
					<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
						{{ row.label }}
					</dt>
					<dd class="mt-1 break-words text-sm text-gray-900 dark:text-gray-100">
						{{ row.value }}
					</dd>
				</div>
				<div
					v-for="bar in usageBars"
					:key="bar.label"
					class="px-3 py-2"
				>
					<div class="flex items-baseline justify-between gap-3">
						<dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
							{{ bar.label }}
						</dt>
						<dd class="text-sm font-semibold text-gray-900 dark:text-white">
							{{ bar.percent }}%
						</dd>
					</div>
					<div class="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
						<div
							class="h-full rounded-full"
							:class="bar.percent >= 90 ? 'bg-red-500' : bar.percent >= 80 ? 'bg-amber-500' : 'bg-[#90e884]'"
							:style="{ width: `${bar.percent}%` }"
						/>
					</div>
				</div>
				<div
					v-for="disk in disks"
					:key="disk.path"
					class="px-3 py-2"
				>
					<div class="flex items-baseline justify-between gap-3">
						<dt class="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-gray-400">
							{{ disk.path }}
						</dt>
						<dd class="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
							{{ disk.used }}%<span
								v-if="disk.total"
								class="font-normal text-gray-500"
							> · {{ bytesToSize(disk.total) }}</span>
						</dd>
					</div>
					<div class="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
						<div
							class="h-full rounded-full"
							:class="disk.used >= 90 ? 'bg-red-500' : disk.used >= 80 ? 'bg-amber-500' : 'bg-[#90e884]'"
							:style="{ width: `${disk.used}%` }"
						/>
					</div>
				</div>
			</dl>
		</AppCard>

		<AppCard v-if="device?.updates_status">
			<div class="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<div class="flex min-w-0 items-center gap-2.5">
					<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								fill="currentColor"
								d="M12 4a1 1 0 0 1 1 1v7.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V5a1 1 0 0 1 1-1m-7 13a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"
							/>
						</svg>
					</span>
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
						Updates
					</h3>
				</div>
				<button
					type="button"
					class="inline-flex items-center rounded-md border border-primary-200 bg-white px-2 py-1 text-xs font-medium text-primary-800"
					@click="updatesOpen = true"
				>
					Details
				</button>
			</div>
			<div class="flex flex-wrap gap-3 px-3 py-3">
				<div class="flex items-center gap-3">
					<span class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-800 text-sm font-semibold text-white">
						{{ device.updates_status.updates_available }}
					</span>
					<span class="text-sm font-medium text-gray-800 dark:text-gray-100">Updates</span>
				</div>
				<div class="flex items-center gap-3">
					<span
						class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
						:class="device.updates_status.security_updates_available ? 'bg-red-500' : 'bg-gray-300'"
					>
						{{ device.updates_status.security_updates_available }}
					</span>
					<span class="text-sm font-medium text-gray-800 dark:text-gray-100">Security</span>
				</div>
			</div>
			<p
				v-if="device.updates_status.reboot_pending"
				class="mx-3 mb-3 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800"
			>
				Reboot pending
			</p>
		</AppCard>

	</div>

	<TagsLabelDialog
		v-model="tagsOpen"
		:model-value-client="device"
	/>
	<Modal
		v-model="updatesOpen"
		:title="`Updates for ${device?.name || 'this device'}`"
		ok-text="Close"
		:show-cancel="false"
		@ok="updatesOpen = false"
	>
		<div class="max-h-[70dvh] overflow-auto px-4 py-2">
			<p
				v-if="!device?.updates_status?.update_summaries?.length"
				class="py-6 text-sm text-gray-500"
			>
				No update details.
			</p>
			<ul
				v-else
				class="divide-y divide-gray-100"
			>
				<li
					v-for="(update, index) in device.updates_status.update_summaries"
					:key="index"
					class="py-3"
				>
					<p class="text-sm font-medium text-gray-900">
						{{ update.title }}
					</p>
					<p
						v-if="update.is_security_update"
						class="mt-1 text-xs font-medium text-red-600"
					>
						Security update
					</p>
					<p
						v-if="update.description"
						class="mt-1 text-sm text-gray-600"
					>
						{{ update.description }}
					</p>
				</li>
			</ul>
		</div>
	</Modal>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import TagsLabelDialog from '~/components/device/TagsLabelDialog.vue';
import Modal from '~/components/Modal.vue';
import { bytesToSize, formatedDate } from '~/lib/utils';

const props = defineProps({
	device: {
		type: Object,
		required: true,
	},
	metrics: {
		type: Array,
		default: () => [],
	},
});

const { copy } = useClipboard();
const { $api } = useNuxtApp();
const tagsOpen = ref(false);
const updatesOpen = ref(false);
const disks = ref<{ path: string; used: number; total: number }[]>([]);

const filled = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== '';

const formatColombia = (dateString: string) => {
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return '';
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'America/Bogota',
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(date);
	const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
	return `${part('day')}-${part('month')}-${part('year')} ${part('hour')}:${part('minute')}:${part('second')}`;
};

const identityRows = computed(() => {
	const device = props.device || {};
	const rows: { label: string; value: string; copy?: boolean }[] = [];
	if (filled(device.hostname)) rows.push({ label: 'Hostname', value: String(device.hostname) });
	if (filled(device.id)) rows.push({ label: 'Client ID', value: String(device.id), copy: true });
	if (filled(device.version)) rows.push({ label: 'Agent', value: String(device.version) });
	if (filled(device.client_auth_id)) {
		rows.push({ label: 'Auth ID', value: String(device.client_auth_id) });
	}
	if (device.last_heartbeat_at) {
		rows.push({ label: 'Last heartbeat', value: formatedDate(String(device.last_heartbeat_at)) });
	}
	else if (device.disconnected_at) {
		rows.push({ label: 'Disconnected since', value: formatColombia(String(device.disconnected_at)) });
	}
	return rows;
});

const kernelRelease = (device: { os?: string; os_kernel?: string }) => {
	const parts = String(device.os || '').trim().split(/\s+/);
	if (parts.length >= 3 && /^linux$/i.test(parts[0]) && parts[2] && !/^linux$/i.test(parts[2])) return parts[2];
	const stored = String(device.os_kernel || '').trim();
	if (stored && !/^linux$/i.test(stored)) return stored;
	return '';
};

const systemRows = computed(() => {
	const device = props.device || {};
	const rows: { label: string; value: string }[] = [];
	if (filled(device.os_full_name)) rows.push({ label: 'OS', value: String(device.os_full_name) });
	const kernel = kernelRelease(device);
	if (kernel) rows.push({ label: 'Kernel', value: kernel });
	if (filled(device.os_arch)) rows.push({ label: 'Architecture', value: String(device.os_arch) });
	return rows;
});

const resourceRows = computed(() => {
	const device = props.device || {};
	const rows: { label: string; value: string }[] = [];
	const cpu = device.cpu_model_name || device.cpu_model;
	if (filled(cpu)) rows.push({ label: 'CPU', value: String(cpu) });
	if (filled(device.num_cpus)) rows.push({ label: 'Cores', value: String(device.num_cpus) });
	if (filled(device.mem_total)) rows.push({ label: 'Memory', value: bytesToSize(Number(device.mem_total)) });
	return rows;
});

const percent = (value: unknown) => {
	const number = Number(value);
	if (!Number.isFinite(number)) return 0;
	return Math.min(100, Math.max(0, Math.round(number)));
};

const usageBars = computed(() => {
	const latest = props.metrics?.[0] as { cpu_usage_percent?: number; memory_usage_percent?: number; io_usage_percent?: number } | undefined;
	if (!latest) return [];
	return [
		{ label: 'CPU usage', percent: percent(latest.cpu_usage_percent) },
		{ label: 'Memory usage', percent: percent(latest.memory_usage_percent) },
		{ label: 'Disk IO', percent: percent(latest.io_usage_percent) },
	];
});

const skipDisk = (path: string) => /\/(snap|run|dev|sys|proc|tmp)(\/|$)/.test(path);

const parseDisks = (raw: unknown) => {
	let data: Record<string, number> = {};
	if (typeof raw === 'string') {
		try {
			data = JSON.parse(raw);
		}
		catch {
			return [];
		}
	}
	else if (raw && typeof raw === 'object') {
		data = raw as Record<string, number>;
	}
	const paths = new Set<string>();
	Object.keys(data).forEach((key) => {
		const dot = key.indexOf('.');
		if (dot > 0) paths.add(key.slice(dot + 1));
	});
	return [...paths]
		.filter(path => !skipDisk(path))
		.map(path => ({
			path,
			used: percent(data[`used_percent.${path}`]),
			total: Number(data[`total_b.${path}`] || 0),
		}))
		.filter(disk => Number.isFinite(Number(data[`used_percent.${disk.path}`])))
		.sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : b.used - a.used))
		.slice(0, 4);
};

const loadDisks = async (id: string) => {
	try {
		const response = await $api.clients.mountpoints(id);
		const row = response?.data?.[0];
		disks.value = parseDisks(row?.mountpoints);
	}
	catch {
		disks.value = [];
	}
};

watch(() => props.device?.id, (id) => {
	disks.value = [];
	if (typeof id === 'string' && id) loadDisks(id);
}, { immediate: true });
</script>
