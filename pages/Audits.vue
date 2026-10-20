<template>
	<new-page-wrapper>
		<div class="app-page mx-auto min-h-0 w-full max-w-7xl overflow-y-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h3 class="text-2xl font-semibold text-gray-800">
						Audit logs
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						Recent actions recorded by the server.
					</p>
				</div>
				<button
					type="button"
					class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
					@click="load"
				>
					Reload
				</button>
			</div>
			<p
				v-if="notice"
				class="mt-3 text-sm text-red-700"
			>
				{{ notice }}
			</p>
			<div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
				<table class="min-w-full divide-y divide-gray-200 text-sm">
					<thead class="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
						<tr>
							<th class="px-4 py-3">Client</th>
							<th class="px-4 py-3">Username</th>
							<th class="px-4 py-3">Application</th>
							<th class="px-4 py-3">Action</th>
							<th class="px-4 py-3">Date</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						<tr
							v-for="(entry, index) in entries"
							:key="`${entry.timestamp}-${entry.affected_id}-${index}`"
						>
							<td class="px-4 py-3 text-gray-800">{{ entry.client_hostname || entry.client_id || '—' }}</td>
							<td class="px-4 py-3 text-gray-600">{{ entry.username || '—' }}</td>
							<td class="px-4 py-3 text-gray-600">{{ entry.application || '—' }}</td>
							<td class="px-4 py-3 text-gray-600">{{ entry.action || '—' }}</td>
							<td class="px-4 py-3 text-gray-600">{{ formatWhen(entry.timestamp) }}</td>
						</tr>
						<tr v-if="!entries.length">
							<td
								colspan="5"
								class="px-4 py-8 text-center text-gray-500"
							>
								{{ pending ? 'Loading…' : 'No audit entries' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="mt-3 flex items-center justify-between text-sm text-gray-500">
				<span>{{ total }} entries</span>
				<div class="flex gap-2">
					<button
						type="button"
						class="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
						:disabled="page === 0 || pending"
						@click="changePage(page - 1)"
					>
						Previous
					</button>
					<button
						type="button"
						class="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
						:disabled="pending || (page + 1) * pageSize >= total"
						@click="changePage(page + 1)"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
import { apiErrorMessage } from '~/lib/apiError';
import type { AuditLog } from '~/types';

const { $api } = useNuxtApp();
const entries = ref<AuditLog[]>([]);
const total = ref(0);
const page = ref(0);
const pageSize = 100;
const pending = ref(false);
const notice = ref('');

const formatWhen = (value?: string | Date) => {
	if (!value) return '—';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat('en-GB', {
		timeZone: 'America/Bogota',
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}).format(date);
};

const load = async () => {
	pending.value = true;
	notice.value = '';
	try {
		const response = await $api.audit.list(page.value * pageSize, pageSize);
		entries.value = response.data ?? [];
		total.value = response.meta?.count ?? entries.value.length;
	}
	catch (error) {
		entries.value = [];
		total.value = 0;
		notice.value = apiErrorMessage(error, 'Could not load audit logs.');
	}
	finally {
		pending.value = false;
	}
};

const changePage = async (next: number) => {
	page.value = next;
	await load();
};

onMounted(load);
</script>
