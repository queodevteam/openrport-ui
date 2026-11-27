<template>
	<div class="grid gap-3">
		<AppCard>
			<div class="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<div class="flex min-w-0 items-center gap-2.5">
					<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="currentColor" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3v2h1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h1v-2H6a2 2 0 0 1-2-2zm8 10v2h.01V16zM6 6v8h12V6z" />
						</svg>
					</span>
					<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
						Tunnels
					</h3>
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<RefreshButton
						:pending="refreshing"
						@refresh="reloadTunnels"
					/>
					<button
						type="button"
						class="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white"
						@click="$emit('addtunnel')"
					>
						Add tunnel
					</button>
				</div>
			</div>
			<p
				v-if="refreshNote"
				class="border-b border-gray-100 px-3 py-2 text-xs text-gray-500 dark:border-gray-800"
			>
				{{ refreshNote }}
			</p>
			<div class="overflow-x-auto">
				<table
					class="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800"
					:class="refreshing ? 'opacity-60' : ''"
				>
										<thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-gray-950">
											<tr>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Allowed clients</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Exposed port</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>HTTP proxy</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Destination</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Port</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Protocol</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Name</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Created at</span>
													</button>
												</th>
												<th
													class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6"
												/>
												<th
													class="relative w-6 whitespace-nowrap py-3.5 pl-3 pr-2 text-right text-sm font-medium sm:pr-2"
												/>
											</tr>
										</thead>
										<tbody class="z-10 divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
											<tr
												v-if="tunnels?.tunnels?.length <= 0"
												class="h-[210px] bg-white/10 backdrop-blur-sm dark:bg-black/10"
											>
												<td
													colspan="10"
													class="w-full flex-1 text-center text-gray-800 dark:text-gray-200"
												>
													No results
												</td>
											</tr>
											<tr
												v-for="tunnel in tunnels?.tunnels"
												:key="tunnel.id"
												class="cursor-pointer border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700"
												@click="openActiveTunnel(tunnel, config.public.apiUrl)"
											>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tunnel.acl }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													<div class="inline-flex w-max cursor-pointer">
														<span>{{ tunnel.lport }}</span>
													</div>
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tunnel.http_proxy ? 'Enabled': 'Disabled' }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tunnel.rhost }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tunnel.rport }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													<span class="text-center">{{ tunnel.protocol }}<span>:{{ tunnel.scheme }}</span></span>
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													-
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													<div class="inline-flex w-max cursor-pointer">
														{{ useTimeAgo(new Date(tunnel.created_at)).value }}
													</div>
												</td>
												<td
													class="pr-1 sm:pr-1 relative w-8 whitespace-nowrap py-3.5 pl-3 text-right text-sm font-normal"
													@click.stop
												>
													<TunnelRowMenu
														:ssh="isSshTunnel(tunnel)"
														@copy-ssh="copySsh(tunnel, $event)"
														@update="openActiveUpdate(tunnel)"
														@delete="openDelete('active', tunnel)"
													/>
												</td>
												<td class="pl-1 relative w-8 whitespace-nowrap py-3.5 pl-3 text-right text-sm font-normal">
													<span class="absolute inset-y-0 right-0 flex w-6 items-center justify-center pr-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
															aria-hidden="true"
															class="h-6 w-6 text-gray-300 transition-all duration-300 group-hover:text-gray-700 dark:text-gray-700 group-hover:dark:text-gray-200"
														>
															<path
																fill-rule="evenodd"
																d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																clip-rule="evenodd"
															/>
														</svg>
													</span>
												</td>
												<!--												<div class="inline-flex w-max cursor-pointer"> -->
												<!--													<button class="absolute inset-y-0 left-0 right-16 z-10 w-[90%]" /> -->
												<!--													<button class="absolute inset-y-0 right-0 z-10 w-8" /> -->
												<!--													<button class="absolute inset-y-0 left-0 right-16 z-10 w-12" /> -->
												<!--													&lt;!&ndash;&ndash;&gt; -->
												<!--												</div> -->
											</tr>
										</tbody>
				</table>
			</div>
		</AppCard>
		<AppCard>
			<div class="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/60">
				<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm ring-1 ring-gray-200">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
						<path fill="currentColor" d="M5 4h14a2 2 0 0 1 2 2v3H3V6a2 2 0 0 1 2-2m-2 7h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm5 3v2h4v-2z" />
					</svg>
				</span>
				<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
					Stored tunnels
				</h3>
			</div>
			<p
				v-if="startError"
				class="mx-3 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
				role="alert"
			>
				{{ startError }}
			</p>
			<div class="overflow-x-auto">
				<table
					class="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800"
					:class="refreshing ? 'opacity-60' : ''"
				>
										<thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-gray-950">
											<tr>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Allowed clients</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Scheme</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Destination</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Port</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span>Name</span>
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span />
													</button>
												</th>
												<th
													class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
													scope="col"
												>
													<button disabled="">
														<span />
													</button>
												</th>
												<th
													class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6"
												/>
												<th
													class="relative w-6 whitespace-nowrap py-3.5 pl-3 pr-2 text-right text-sm font-medium sm:pr-2"
												/>
											</tr>
										</thead>
										<tbody class="z-10 divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
											<tr
												v-if="storedTuns?.length <= 0"
												class="h-[210px] bg-white/10 backdrop-blur-sm dark:bg-black/10"
											>
												<td
													colspan="9"
													class="w-full flex-1 text-center text-gray-800 dark:text-gray-200"
												>
													No results
												</td>
											</tr>
											<tr
												v-for="tun in storedTuns"
												class="cursor-pointer hover:bg-vtd-primary-600/30 border-t-1 group relative border-gray-200 transition-all duration-300"
												:class="{ 'opacity-60': startingId === tun.id }"
												@click="startStored(tun)"
											>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tun.acl || '—' }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													<span>{{ tun.scheme }}</span>
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tun.remote_ip || '—' }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tun.remote_port }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ tun.name }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
													{{ String(tun.further_options?.is_service_forwarding) }}
												</td>
												<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6" />
												<td
													class="pr-1 sm:pr-1 relative w-8 whitespace-nowrap py-3.5 pl-3 text-right text-sm font-normal"
													@click.stop
												>
													<TunnelRowMenu
														@update="openStoredUpdate(tun)"
														@delete="openDelete('stored', tun)"
													/>
												</td>
												<td class="pl-1 relative w-8 whitespace-nowrap py-3.5 pl-3 text-right text-sm font-normal">
													<span class="absolute inset-y-0 right-0 flex w-6 items-center justify-center pr-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
															aria-hidden="true"
															class="h-6 w-6 text-gray-300 transition-all duration-300 group-hover:text-gray-700 dark:text-gray-700 group-hover:dark:text-gray-200"
														>
															<path
																fill-rule="evenodd"
																d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																clip-rule="evenodd"
															/>
														</svg>
													</span>
												</td>
												<!--												<div class="inline-flex w-max cursor-pointer"> -->
												<!--													<button class="absolute inset-y-0 left-0 right-16 z-10 w-[90%]" /> -->
												<!--													<button class="absolute inset-y-0 right-0 z-10 w-8" /> -->
												<!--													<button class="absolute inset-y-0 left-0 right-16 z-10 w-12" /> -->
												<!--													&lt;!&ndash;&ndash;&gt; -->
												<!--												</div> -->
											</tr>
										</tbody>
				</table>
			</div>
		</AppCard>
		<BaseModal :model-value="Boolean(editingAcl)">
			<form
				class="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
				@submit.prevent="saveAcl"
			>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
					Update tunnel
				</h3>
				<p class="mt-1 text-sm text-gray-500">
					Who is allowed to use this tunnel.
				</p>
				<label class="mt-4 block text-sm text-gray-700 dark:text-gray-200">
					ACL
					<input
						v-model="aclDraft"
						class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
						type="text"
						placeholder="142.78.90.8,201.98.123.0/24"
					>
				</label>
				<button
					type="button"
					class="mt-2 text-sm text-primary"
					@click="useMyIp('active')"
				>
					Use my current IP
				</button>
				<p
					v-if="actionError"
					class="mt-2 text-sm text-red-500"
				>
					{{ actionError }}
				</p>
				<div class="mt-5 flex justify-end gap-2">
					<button
						type="button"
						class="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
						@click="editingAcl = null"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded bg-primary-800 px-3 py-1.5 text-sm text-white"
						:disabled="saving"
					>
						Save
					</button>
				</div>
			</form>
		</BaseModal>
		<BaseModal :model-value="Boolean(editingStored)">
			<form
				class="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
				@submit.prevent="saveStored"
			>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
					Update stored tunnel
				</h3>
				<div class="mt-4 grid grid-cols-2 gap-3">
					<label class="col-span-2 block text-sm text-gray-700 dark:text-gray-200">
						Name
						<input
							v-model="storedDraft.name"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="text"
							required
						>
					</label>
					<label class="block text-sm text-gray-700 dark:text-gray-200">
						Scheme
						<input
							v-model="storedDraft.scheme"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="text"
							required
						>
					</label>
					<label class="block text-sm text-gray-700 dark:text-gray-200">
						Destination
						<input
							v-model="storedDraft.remote_ip"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="text"
							required
						>
					</label>
					<label class="block text-sm text-gray-700 dark:text-gray-200">
						Remote port
						<input
							v-model="storedDraft.remote_port"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="number"
							required
						>
					</label>
					<label class="block text-sm text-gray-700 dark:text-gray-200">
						Public port
						<input
							v-model="storedDraft.public_port"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="number"
							placeholder="0 = random"
						>
					</label>
					<label class="col-span-2 block text-sm text-gray-700 dark:text-gray-200">
						ACL
						<input
							v-model="storedDraft.acl"
							class="mt-1 block h-10 w-full rounded border border-gray-300 bg-transparent px-2 text-sm"
							type="text"
						>
						<button
							type="button"
							class="mt-2 text-sm text-primary"
							@click="useMyIp('stored')"
						>
							Use my current IP
						</button>
					</label>
				</div>
				<p
					v-if="actionError"
					class="mt-2 text-sm text-red-500"
				>
					{{ actionError }}
				</p>
				<div class="mt-5 flex justify-end gap-2">
					<button
						type="button"
						class="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
						@click="editingStored = null"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded bg-primary-800 px-3 py-1.5 text-sm text-white"
						:disabled="saving"
					>
						Save
					</button>
				</div>
			</form>
		</BaseModal>
		<BaseModal :model-value="Boolean(pendingDelete)">
			<div class="max-h-[100dvh] w-full max-w-md overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
					Delete tunnel
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
					This removes {{ pendingDelete?.kind === 'stored' ? 'the stored tunnel' : 'the active tunnel' }}.
				</p>
				<p
					v-if="actionError"
					class="mt-2 text-sm text-red-500"
				>
					{{ actionError }}
				</p>
				<div class="mt-5 flex justify-end gap-2">
					<button
						type="button"
						class="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
						@click="pendingDelete = null"
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
						:disabled="saving"
						@click="confirmDelete"
					>
						Delete
					</button>
				</div>
			</div>
		</BaseModal>
	</div>
</template>

<script setup>
import { useClipboard, useTimeAgo } from '@vueuse/core';
import { BaseModal } from '~/components/ui/base-modal';
import TunnelRowMenu from '~/components/device/TunnelRowMenu.vue';
import {
	duplicateTunnelMessage,
	isSshTunnel,
	openActiveTunnel,
	payloadFromStoredTunnel,
	tunnelErrorMessage,
	tunnelSshCommand,
} from '~/composables/tunnels/storedTunnel';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

defineEmits(['addtunnel']);
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const snackbar = useSnackbar();
const { copy } = useClipboard();
const { refreshing, note: refreshNote, run: runRefresh } = useRefreshFeedback();
const tunnelStore = useTunnelStore();
const profileStore = useProfile();
const startingId = ref(null);
const startError = ref('');
const actionError = ref('');
const saving = ref(false);
const editingAcl = ref(null);
const aclDraft = ref('');
const editingStored = ref(null);
const storedDraft = ref({
	name: '',
	scheme: '',
	remote_ip: '',
	remote_port: '',
	public_port: '',
	acl: '',
	further_options: {},
});
const pendingDelete = ref(null);

const { data: tunnels, error: tunnelsError, refresh: refreshTunnels } = useAsyncData(`tunnels_${props.id}`, () => $api.clients.tunnels(props.id));
const { data: storedTuns, error: storedError, refresh: refreshStored } = useAsyncData(`stored_tunnels_${props.id}`, () => $api.clients.storedTunnels(props.id));

const apiError = (error) => tunnelErrorMessage(error?.data ?? error);

const reloadTunnels = () => runRefresh('Tunnels', async () => {
	await Promise.all([refreshTunnels(), refreshStored()]);
	if (tunnelsError.value) throw tunnelsError.value;
	if (storedError.value) throw storedError.value;
});

const copySsh = async (tunnel, user) => {
	const command = tunnelSshCommand(tunnel, config.public.apiUrl, user);
	if (!command) {
		snackbar.add({
			type: 'error',
			text: 'This tunnel has no exposed port to copy.',
		});
		return;
	}
	try {
		await copy(command);
		snackbar.add({
			type: 'success',
			text: `Copied ${command}`,
		});
	}
	catch {
		snackbar.add({
			type: 'error',
			text: 'Could not copy the SSH command.',
		});
	}
};

const startStored = async (tunnel) => {
	if (startingId.value) return;
	const payload = payloadFromStoredTunnel(tunnel);
	const duplicate = duplicateTunnelMessage(props.id, payload);
	if (duplicate) {
		startError.value = duplicate;
		snackbar.add({
			type: 'error',
			text: duplicate,
		});
		return;
	}
	startingId.value = tunnel.id;
	startError.value = '';
	const { error } = await tunnelStore.createTunnel(props.id, payload);
	startingId.value = null;
	if (error) {
		startError.value = tunnelErrorMessage(error);
		snackbar.add({
			type: 'error',
			text: startError.value,
		});
		return;
	}
	await refreshTunnels();
	snackbar.add({
		type: 'success',
		text: 'Tunnel started',
	});
};

const openActiveUpdate = (tunnel) => {
	actionError.value = '';
	aclDraft.value = tunnel.acl || '';
	editingAcl.value = tunnel;
};

const openStoredUpdate = (tunnel) => {
	actionError.value = '';
	storedDraft.value = {
		name: tunnel.name || '',
		scheme: tunnel.scheme || '',
		remote_ip: tunnel.remote_ip || '',
		remote_port: tunnel.remote_port ?? '',
		public_port: tunnel.public_port ?? '',
		acl: tunnel.acl || '',
		further_options: tunnel.further_options || {},
	};
	editingStored.value = tunnel;
};

const openDelete = (kind, tunnel) => {
	actionError.value = '';
	pendingDelete.value = { kind, tunnel };
};

const useMyIp = async (target) => {
	actionError.value = '';
	await profileStore.loadServerIp();
	if (!profileStore.ip) {
		actionError.value = 'Could not read the IP of this computer.';
		return;
	}
	if (target === 'stored') {
		storedDraft.value.acl = profileStore.ip;
		return;
	}
	aclDraft.value = profileStore.ip;
};

const saveAcl = async () => {
	if (!editingAcl.value || saving.value) return;
	saving.value = true;
	actionError.value = '';
	try {
		await $api.clients.updateTunnelAcl(props.id, editingAcl.value.id, aclDraft.value);
		editingAcl.value = null;
		await refreshTunnels();
	}
	catch (error) {
		actionError.value = apiError(error);
	}
	finally {
		saving.value = false;
	}
};

const saveStored = async () => {
	if (!editingStored.value || saving.value) return;
	saving.value = true;
	actionError.value = '';
	const publicPort = storedDraft.value.public_port === '' ? 0 : Number(storedDraft.value.public_port);
	try {
		await $api.clients.updateStoredTunnel(props.id, {
			...editingStored.value,
			name: storedDraft.value.name,
			scheme: storedDraft.value.scheme,
			remote_ip: storedDraft.value.remote_ip,
			remote_port: Number(storedDraft.value.remote_port),
			public_port: publicPort,
			acl: storedDraft.value.acl,
			further_options: storedDraft.value.further_options,
		});
		editingStored.value = null;
		await refreshStored();
	}
	catch (error) {
		actionError.value = apiError(error);
	}
	finally {
		saving.value = false;
	}
};

const confirmDelete = async () => {
	if (!pendingDelete.value || saving.value) return;
	saving.value = true;
	actionError.value = '';
	const { kind, tunnel } = pendingDelete.value;
	try {
		if (kind === 'stored') {
			await $api.clients.deleteStoredTunnel(props.id, tunnel.id);
			await refreshStored();
		}
		else {
			await $api.clients.deleteTunnel(props.id, tunnel.id);
			await refreshTunnels();
		}
		pendingDelete.value = null;
	}
	catch (error) {
		actionError.value = apiError(error);
	}
	finally {
		saving.value = false;
	}
};
</script>
