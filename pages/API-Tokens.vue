<template>
	<new-page-wrapper is-extra="true">
		<div class="flex min-h-0 flex-1 flex-col xl:flex-row xl:overflow-hidden">
			<new-settings-sidebar />
			<div class="scrollbar-hide max-h-screen flex-1 xl:overflow-y-auto">
				<div class="app-page mx-auto min-h-0 w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
					<div class="flex flex-wrap items-end justify-between gap-3">
						<div>
							<h3 class="text-2xl font-semibold text-gray-800">
								API tokens
							</h3>
							<p class="mt-1 text-sm text-gray-500">
								Tokens for this account. The secret is shown only once, when it is created.
							</p>
						</div>
						<button
							type="button"
							class="inline-flex min-h-11 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white"
							@click="creating = !creating"
						>
							Add API token
						</button>
					</div>

					<form
						v-if="creating"
						class="mt-4 grid max-w-xl gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
						@submit.prevent="createToken"
					>
						<label class="block text-sm text-gray-700">
							Name
							<input
								v-model="form.name"
								required
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							>
						</label>
						<label class="block text-sm text-gray-700">
							Scope
							<select
								v-model="form.scope"
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							>
								<option value="read">read</option>
								<option value="read+write">read+write</option>
								<option value="clients-auth">clients-auth</option>
							</select>
						</label>
						<button
							type="submit"
							class="inline-flex min-h-11 w-fit items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white disabled:opacity-40"
							:disabled="busy"
						>
							Create
						</button>
					</form>

					<div
						v-if="freshToken"
						class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
					>
						<p class="font-medium">Copy this token now. It will not be shown again.</p>
						<div class="mt-2 flex flex-wrap items-center gap-2">
							<code class="break-all font-mono text-xs">{{ freshToken }}</code>
							<button
								type="button"
								class="rounded-lg border border-amber-300 bg-white px-2 py-1 text-xs font-medium"
								@click="copy(freshToken)"
							>
								Copy
							</button>
						</div>
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
									<th class="px-4 py-3">Prefix</th>
									<th class="px-4 py-3">Scope</th>
									<th class="px-4 py-3">Name</th>
									<th class="px-4 py-3">Expires</th>
									<th class="px-4 py-3" />
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								<tr
									v-for="token in tokens"
									:key="token.prefix"
								>
									<td class="px-4 py-3 font-mono text-gray-800">{{ token.prefix }}</td>
									<td class="px-4 py-3 text-gray-600">{{ token.scope }}</td>
									<td class="px-4 py-3 text-gray-800">{{ token.name }}</td>
									<td class="px-4 py-3 text-gray-600">{{ formatWhen(token.expires_at) }}</td>
									<td class="px-4 py-3 text-right">
										<button
											type="button"
											class="text-sm font-medium text-red-700"
											@click="remove(token.prefix)"
										>
											Delete
										</button>
									</td>
								</tr>
								<tr v-if="!tokens.length">
									<td
										colspan="5"
										class="px-4 py-8 text-center text-gray-500"
									>
										No tokens
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
import { apiErrorMessage } from '~/lib/apiError';
import type { APIToken } from '~/types';

const { $api } = useNuxtApp();
const tokens = ref<APIToken[]>([]);
const creating = ref(false);
const busy = ref(false);
const notice = ref('');
const freshToken = ref('');
const form = reactive({ name: '', scope: 'read' });

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
		hourCycle: 'h23',
	}).format(date);
};

const load = async () => {
	try {
		const response = await $api.profile.apiTokens();
		tokens.value = response.data ?? [];
		if (tokens.value.length) notice.value = '';
	}
	catch (error) {
		tokens.value = [];
		notice.value = apiErrorMessage(error, 'Could not load API tokens.');
	}
};

const createToken = async () => {
	busy.value = true;
	notice.value = '';
	freshToken.value = '';
	try {
		const response = await $api.profile.create({
			name: form.name.trim(),
			scope: form.scope,
		});
		freshToken.value = response.data?.token || '';
		form.name = '';
		creating.value = false;
		await load();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not create the token.');
	}
	finally {
		busy.value = false;
	}
};

const remove = async (prefix: string) => {
	notice.value = '';
	try {
		await $api.profile.delete(prefix);
		await load();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not delete the token.');
	}
};

const copy = async (value: string) => {
	await navigator.clipboard.writeText(value);
};

onMounted(load);
</script>
