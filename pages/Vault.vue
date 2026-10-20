<template>
	<new-page-wrapper is-extra="true">
		<div class="flex min-h-0 flex-1 flex-col xl:flex-row xl:overflow-hidden">
			<new-settings-sidebar />
			<div class="scrollbar-hide max-h-screen flex-1 xl:overflow-y-auto">
				<div class="app-page mx-auto min-h-0 w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
					<h3 class="text-2xl font-semibold text-gray-800">
						Vault
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						{{ statusLabel }}
					</p>
					<p
						v-if="notice"
						class="mt-3 text-sm text-red-700"
					>
						{{ notice }}
					</p>

					<div
						v-if="mode !== 'unlocked'"
						class="mt-6 max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
					>
						<label class="block text-sm text-gray-700">
							Passphrase
							<input
								v-model="password"
								type="password"
								autocomplete="new-password"
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							>
						</label>
						<label
							v-if="mode === 'init'"
							class="mt-3 block text-sm text-gray-700"
						>
							Repeat passphrase
							<input
								v-model="repeat"
								type="password"
								autocomplete="new-password"
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							>
						</label>
						<p
							v-if="mode === 'init'"
							class="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800"
						>
							A lost passphrase cannot be recovered.
						</p>
						<button
							type="button"
							class="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white disabled:opacity-40"
							:disabled="busy || !password || (mode === 'init' && password !== repeat)"
							@click="submit"
						>
							{{ mode === 'init' ? 'Initialize vault' : 'Unlock vault' }}
						</button>
					</div>

					<div
						v-else
						class="mt-6"
					>
						<button
							type="button"
							class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
							:disabled="busy"
							@click="lock"
						>
							Lock vault
						</button>
						<div class="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
							<table class="min-w-full divide-y divide-gray-200 text-sm">
								<thead class="bg-gray-50 text-left text-gray-600">
									<tr>
										<th class="px-4 py-3 font-semibold">Key</th>
										<th class="px-4 py-3 font-semibold">Client</th>
										<th class="px-4 py-3 font-semibold">Created by</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-100">
									<tr
										v-for="item in keys"
										:key="item.id"
									>
										<td class="px-4 py-3 text-gray-800">{{ item.key }}</td>
										<td class="px-4 py-3 text-gray-600">{{ item.client_id || '—' }}</td>
										<td class="px-4 py-3 text-gray-600">{{ item.created_by || '—' }}</td>
									</tr>
									<tr v-if="!keys.length">
										<td
											colspan="3"
											class="px-4 py-8 text-center text-gray-500"
										>
											No vault entries.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
import { apiErrorMessage } from '~/lib/apiError';
import type { VaultKey, VaultStatus } from '~/repository/modules/vault';

const { $api } = useNuxtApp();
const status = ref<VaultStatus>({});
const password = ref('');
const repeat = ref('');
const notice = ref('');
const busy = ref(false);
const keys = ref<VaultKey[]>([]);

const mode = computed(() => {
	if (status.value.init !== 'setup-completed') return 'init';
	if (status.value.status === 'unlocked') return 'unlocked';
	return 'locked';
});

const statusLabel = computed(() => {
	if (mode.value === 'init') return 'The vault is not initialized.';
	if (mode.value === 'locked') return 'The vault is locked.';
	return 'The vault is unlocked.';
});

const load = async () => {
	notice.value = '';
	try {
		const response = await $api.vault.status();
		status.value = response.data ?? {};
		keys.value = [];
		if (mode.value === 'unlocked') {
			const listed = await $api.vault.list();
			keys.value = listed.data ?? [];
		}
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not read the vault.');
	}
};

const submit = async () => {
	busy.value = true;
	notice.value = '';
	try {
		if (mode.value === 'init') await $api.vault.init(password.value);
		else await $api.vault.unlock(password.value);
		password.value = '';
		repeat.value = '';
		await load();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not open the vault.');
	}
	finally {
		busy.value = false;
	}
};

const lock = async () => {
	busy.value = true;
	notice.value = '';
	try {
		await $api.vault.lock();
		await load();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not lock the vault.');
	}
	finally {
		busy.value = false;
	}
};

onMounted(load);
</script>
