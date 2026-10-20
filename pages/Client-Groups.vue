<template>
	<new-page-wrapper is-extra="true">
		<div class="flex min-h-0 flex-1 flex-col xl:flex-row xl:overflow-hidden">
			<new-settings-sidebar />
			<div class="scrollbar-hide max-h-screen flex-1 xl:overflow-y-auto">
				<div class="app-page mx-auto min-h-0 w-full max-w-7xl overflow-y-auto px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
					<div>
						<div class="relative z-20 flex min-h-16 flex-wrap items-center justify-between gap-3">
							<div class="">
								<h3 class="text-2xl font-semibold leading-tight text-gray-800 dark:text-white">
									Client groups
								</h3>
							</div>
							<div class="flex-1" />
							<div class="ml-2 flex-shrink-0">
								<a
									href="https://chrome.google.com/webstore/detail/secure-shell-app/iodihamcpbpeioajjeobimgagajmlibd/organize-clients-with-groups"
									rel="noopener noreferrer"
									target="_blank"
									class="cursor-pointer text-vtd-primary-500 underline transition-all duration-300 hover:text-vtd-primary-500 dark:text-vtd-primary-400 dark:hover:text-vtd-primary-400 text-sm"
								>
									Learn more </a>
								<button
									class="bg-vtd-primary-500 hover:bg-vtd-primary-700 focus-visible:outline-vtd-primary-600 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:focus-visible:outline-gray-400 text-white disabled:text-gray-500 cursor-pointer rounded-md px-2.5 py-1.5 text-sm relative font-semibold shadow-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ml-4"
									type="button"
									@click="openCreate"
								>
									<!----><!---->
									<span
										class="flex items-center justify-center gap-x-2"
									><!----> Add group
									</span>
								</button>
							</div>
						</div>
						<form
							v-if="mode !== 'closed'"
							ref="formEl"
							class="relative z-20 mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
							@submit.prevent="save"
						>
							<h4 class="text-sm font-semibold text-gray-800">
								{{ mode === 'create' ? 'Add group' : 'Edit group' }}
							</h4>
							<div class="mt-3 grid gap-3 sm:grid-cols-2">
								<label class="block text-sm text-gray-700">
									ID
									<input
										v-model="idLabel"
										maxlength="30"
										required
										class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
										placeholder="site norte"
									>
								</label>
								<label class="block text-sm text-gray-700">
									Description
									<input
										v-model="form.description"
										class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
									>
								</label>
							</div>
							<p class="mt-1 text-xs text-gray-500">
								Up to 30 characters. Spaces are saved as hyphens.
							</p>
							<p
								v-if="mode === 'edit' && canonicalId !== originalId"
								class="mt-1 text-xs text-gray-500"
							>
								Saving replaces {{ groupLabel(originalId) }} with this ID.
							</p>
							<div class="mt-4">
								<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
									Allowed user groups
								</p>
								<div
									v-if="groupChoices.length"
									class="mt-2 max-h-36 space-y-1 overflow-y-auto"
								>
									<label
										v-for="name in groupChoices"
										:key="name"
										class="flex items-center gap-2 text-sm text-gray-700"
									>
										<input
											type="checkbox"
											class="h-4 w-4 rounded border-slate-300 text-primary-800"
											:checked="form.allowed.includes(name)"
											@change="toggleAllowed(name)"
										>
										<span>{{ name }}</span>
									</label>
								</div>
								<input
									v-else
									:value="form.allowed.join(', ')"
									class="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
									placeholder="Administrators, Operators"
									@input="setAllowedText"
								>
							</div>
							<div class="mt-4">
								<div class="flex items-center justify-between gap-3">
									<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
										Device criteria
									</p>
									<button
										type="button"
										class="text-sm font-medium text-primary-800"
										@click="form.rules.push({ field: 'hostname', value: '' })"
									>
										Add criterion
									</button>
								</div>
								<p class="mt-1 text-xs text-gray-500">
									A group with no criteria matches no devices. Use * as a wildcard. Separate values with commas.
								</p>
								<div
									v-for="(rule, index) in form.rules"
									:key="index"
									class="mt-2 grid gap-2 sm:grid-cols-[12rem_minmax(0,1fr)_auto]"
								>
									<select
										v-model="rule.field"
										class="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
									>
										<option
											v-for="field in criteriaFields"
											:key="field.id"
											:value="field.id"
										>
											{{ field.label }}
										</option>
									</select>
									<input
										v-model="rule.value"
										class="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
										placeholder="norte*, sur"
									>
									<button
										type="button"
										class="text-sm font-medium text-red-700"
										@click="form.rules.splice(index, 1)"
									>
										Remove
									</button>
								</div>
								<div class="mt-3 grid gap-2 sm:grid-cols-[12rem_minmax(0,1fr)]">
									<select
										v-model="form.tagOperator"
										class="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
									>
										<option value="or">Any tag</option>
										<option value="and">All tags</option>
									</select>
									<input
										v-model="form.tags"
										class="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
										placeholder="Tags, separated by commas"
									>
								</div>
							</div>
							<p
								v-if="notice"
								class="mt-3 text-sm text-red-700"
							>
								{{ notice }}
							</p>
							<div class="mt-4 flex gap-2">
								<button
									type="submit"
									class="inline-flex min-h-11 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white disabled:opacity-40"
									:disabled="busy || !idOk"
								>
									Save
								</button>
								<button
									type="button"
									class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
									@click="closeForm"
								>
									Cancel
								</button>
							</div>
						</form>
						<p
							v-else-if="notice"
							class="mt-3 text-sm text-red-700"
						>
							{{ notice }}
						</p>
						<div class="relative z-10 w-full">
							<!---->
							<div
								class="flow-root overflow-hidden border border-gray-100 ring-1 ring-black ring-opacity-10 dark:border-gray-600 sm:rounded-lg"
							>
								<div class="overflow-auto relative z-10 -mb-2">
									<div class="inline-block min-w-full align-middle">
										<div class="sm:rounded-t-lg overflow-hidden">
											<div>
												<table class="app-table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
													<thead class="rounded-lg bg-gray-50 dark:bg-gray-950">
														<tr>
															<th
																class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
																scope="col"
															>
																<button
																	disabled=""
																>
																	<span>ID</span><!---->
																</button>
															</th>
															<th
																class="text-left py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
																scope="col"
															>
																<button disabled="">
																	<span>Allowed user
																		groups</span><!---->
																</button>
															</th>
															<th
																class="text-center py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-600 dark:text-gray-200 sm:pl-6"
																scope="col"
															>
																<button
																	disabled=""
																>
																	<span>Devices</span>
																</button>
															</th>
															<th
																class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6"
															/><!---->
														</tr>
													</thead>
													<tbody
														class="z-10 divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-900"
													>
														<tr
															v-for="group in response?.data"
															:key="group.id"
															class="border-t-1 group relative border-gray-200 transition-all duration-300"
														>
															<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
																<div class="flex items-center">
																	<svg
																		data-v-ca945699=""
																		xmlns="http://www.w3.org/2000/svg"
																		xmlns:xlink="http://www.w3.org/1999/xlink"
																		aria-hidden="true"
																		role="img"
																		class="icon"
																		width="18px"
																		height="18px"
																		viewBox="0 0 24 24"
																	><path
																		fill="currentColor"
																		d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V8h16z"
																	/></svg>
																	<span class="ml-2">{{ groupLabel(group.id) }}</span>
																</div>
															</td>
															<td class="text-left min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
																<div class="max-w-sm truncate">
																	<div class="inline-flex w-max cursor-pointer">
																		<span>{{ group.allowed_user_groups?.join(', ') }}</span>
																	</div>
																</div>
															</td>
															<td class="text-center min-h-[42px] whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-normal text-gray-800 dark:text-white sm:pl-6">
																{{ group.num_clients ?? 0 }}
															</td>
															<td class="pr-4 sm:pr-6 relative w-8 whitespace-nowrap py-3.5 pl-3 text-right text-sm font-normal">
																<DropdownMenu>
																	<DropdownMenuTrigger as-child>
																		<button
																			type="button"
																			class="z-20 inline-flex h-8 w-8 items-center justify-center rounded-full p-1 text-gray-600 hover:bg-primary-500/30 hover:text-gray-200"
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				width="20px"
																				height="20px"
																				viewBox="0 0 24 24"
																				class="icon"
																			>
																				<path
																					fill="currentColor"
																					d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2Z"
																				/>
																			</svg>
																		</button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		align="end"
																		class="z-50 min-w-36 rounded-md bg-white p-1 shadow-lg ring-1 ring-black/10"
																	>
																		<DropdownMenuItem
																			class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-gray-800"
																			@click="openEdit(group.id)"
																		>
																			<Pencil class="mr-2 h-4 w-4" />
																			<span>Edit</span>
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs text-red-700"
																			@click="remove(group.id)"
																		>
																			<Trash2 class="mr-2 h-4 w-4" />
																			<span>Delete</span>
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</td>
														</tr>
														<tr
															v-if="!response?.data?.length"
															class="h-[210px] bg-white/10 backdrop-blur-sm dark:bg-black/10"
														>
															<td
																colspan="4"
																class="w-full flex-1 text-center text-gray-800 dark:text-gray-200"
															>
																{{ loadError || (pending ? 'Loading groups…' : 'No groups') }}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<p class="px-4 py-3 text-xs text-gray-500">
									{{ response?.data?.length || 0 }} groups
								</p>
							</div>
							<div class="h-12 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import { apiErrorMessage } from '~/lib/apiError';
import { groupId, groupLabel } from '~/lib/groupId';

const criteriaFields = [
	{ id: 'client_id', label: 'Client ID' },
	{ id: 'name', label: 'Name' },
	{ id: 'hostname', label: 'Hostname' },
	{ id: 'os', label: 'OS' },
	{ id: 'os_family', label: 'OS family' },
	{ id: 'os_arch', label: 'OS arch' },
	{ id: 'os_kernel', label: 'OS kernel' },
	{ id: 'ipv4', label: 'IPv4' },
	{ id: 'ipv6', label: 'IPv6' },
	{ id: 'address', label: 'Address' },
	{ id: 'version', label: 'Version' },
	{ id: 'client_auth_id', label: 'Client auth ID' },
	{ id: 'connection_state', label: 'Connection' },
];

const { $api } = useNuxtApp();
const clientStore = useClientStore();
const formEl = ref<HTMLElement | null>(null);
const loadError = ref('');
const notice = ref('');
const busy = ref(false);
const mode = ref<'closed' | 'create' | 'edit'>('closed');
const originalId = ref('');
const userGroupNames = ref<string[]>([]);
const form = reactive({
	id: '',
	description: '',
	allowed: [] as string[],
	rules: [] as { field: string; value: string }[],
	tagOperator: 'or' as 'or' | 'and',
	tags: '',
});

const canonicalId = computed(() => groupId(form.id.trim()));
const idLabel = computed({
	get: () => form.id,
	set: (value: string) => {
		form.id = groupLabel(groupId(value));
	},
});
const idOk = computed(() => /^[A-Za-z0-9_*-]{1,30}$/.test(canonicalId.value));
const groupChoices = computed(() => [...new Set([...userGroupNames.value, ...form.allowed])].sort());

const splitList = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);

const blankForm = () => {
	originalId.value = '';
	form.id = '';
	form.description = '';
	form.allowed = [];
	form.rules = [];
	form.tagOperator = 'or';
	form.tags = '';
};

const closeForm = () => {
	mode.value = 'closed';
	notice.value = '';
};

const openCreate = () => {
	blankForm();
	notice.value = '';
	mode.value = 'create';
};

const paramsToForm = (params: Record<string, unknown> | null | undefined) => {
	form.rules = [];
	form.tags = '';
	form.tagOperator = 'or';
	if (!params) return;
	for (const field of criteriaFields) {
		const values = params[field.id];
		if (Array.isArray(values) && values.length) {
			form.rules.push({ field: field.id, value: values.map(String).join(', ') });
		}
	}
	const tag = params.tag;
	if (Array.isArray(tag)) {
		form.tags = tag.map(String).join(', ');
	}
	else if (tag && typeof tag === 'object') {
		const entry = Object.entries(tag as Record<string, unknown>)[0];
		if (entry) {
			form.tagOperator = String(entry[0]).toLowerCase() === 'and' ? 'and' : 'or';
			form.tags = Array.isArray(entry[1]) ? entry[1].map(String).join(', ') : '';
		}
	}
};

const buildParams = () => {
	const params: Record<string, string[] | { and: string[] }> = {};
	for (const rule of form.rules) {
		const values = splitList(rule.value);
		if (!rule.field || !values.length) continue;
		const current = params[rule.field];
		params[rule.field] = Array.isArray(current) ? [...current, ...values] : values;
	}
	const tags = splitList(form.tags);
	if (tags.length) params.tag = form.tagOperator === 'and' ? { and: tags } : tags;
	return params;
};

const payload = () => ({
	id: canonicalId.value,
	description: form.description,
	params: buildParams(),
	allowed_user_groups: [...form.allowed],
});

const reloadSidebar = async () => {
	await clientStore.loadGroups();
	clientStore.listRevision += 1;
};

const { data: response, pending, refresh } = useLazyAsyncData('client-groups-all', async () => {
	try {
		loadError.value = '';
		return await $api.groups.listAll();
	}
	catch (error) {
		loadError.value = apiErrorMessage(error, 'Could not load client groups.');
		throw error;
	}
});

onMounted(async () => {
	try {
		const groups = await $api.userGroups.all();
		userGroupNames.value = groups.map(group => group.name).filter(Boolean);
	}
	catch {
		userGroupNames.value = [];
	}
});

const setAllowedText = (event: Event) => {
	form.allowed = splitList((event.target as HTMLInputElement).value);
};

const toggleAllowed = (name: string) => {
	form.allowed = form.allowed.includes(name)
		? form.allowed.filter(item => item !== name)
		: [...form.allowed, name];
};

const openEdit = async (id: string) => {
	notice.value = '';
	busy.value = true;
	try {
		const result = await $api.groups.show(id);
		const group = result.data;
		originalId.value = group.id;
		form.id = groupLabel(group.id);
		form.description = group.description || '';
		form.allowed = Array.isArray(group.allowed_user_groups) ? [...group.allowed_user_groups] : [];
		paramsToForm(group.params as Record<string, unknown> | undefined);
		mode.value = 'edit';
		await nextTick();
		formEl.value?.scrollIntoView({ block: 'start', behavior: 'smooth' });
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not load this group.');
	}
	finally {
		busy.value = false;
	}
};

const save = async () => {
	if (!idOk.value || busy.value) return;
	busy.value = true;
	notice.value = '';
	try {
		if (mode.value === 'edit' && canonicalId.value === originalId.value) {
			await $api.groups.update(originalId.value, payload());
		}
		else if (mode.value === 'edit') {
			await $api.groups.create(payload() as never);
			try {
				await $api.groups.delete(originalId.value);
			}
			catch (error) {
				await refresh();
				await reloadSidebar();
				originalId.value = canonicalId.value;
				form.id = groupLabel(canonicalId.value);
				notice.value = apiErrorMessage(error, 'The group was copied to the new ID, but the previous one is still there.');
				return;
			}
		}
		else {
			await $api.groups.create(payload() as never);
		}
		await refresh();
		await reloadSidebar();
		closeForm();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not save the group.');
	}
	finally {
		busy.value = false;
	}
};

const remove = async (id: string) => {
	if (!window.confirm(`Delete group ${groupLabel(id)}?`)) return;
	busy.value = true;
	notice.value = '';
	try {
		await $api.groups.delete(id);
		if (canonicalId.value === id || originalId.value === id) closeForm();
		await refresh();
		await reloadSidebar();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not delete the group.');
	}
	finally {
		busy.value = false;
	}
};
</script>
