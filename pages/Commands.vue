<template>
	<new-page-wrapper>
		<div class="app-page mx-auto flex h-full max-h-full min-h-[32rem] w-full max-w-7xl flex-col overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
			<div class="flex shrink-0 flex-wrap items-end justify-between gap-3">
				<div>
					<h3 class="text-2xl font-semibold leading-tight text-gray-800">
						Commands
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						Run a command or a script on several devices, all at once or one by one.
					</p>
				</div>
			</div>

			<div class="mt-4 grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(16rem,1fr)_minmax(9rem,0.75fr)_minmax(8rem,1fr)] gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] xl:grid-rows-[minmax(16rem,0.95fr)_minmax(8rem,1.05fr)]">
				<div class="flex min-h-0 flex-col overflow-hidden rounded-xl border-2 border-slate-300 bg-slate-100 shadow-sm xl:col-start-1 xl:row-start-1">
					<div class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
						<span class="text-xs font-semibold uppercase tracking-wide text-slate-700">Command</span>
						<span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Ctrl+Enter</span>
					</div>
					<div class="grid shrink-0 gap-3 px-3 py-3 sm:grid-cols-2">
						<label class="block text-sm text-slate-700">
							Name
							<input
								v-model="name"
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
								placeholder="Optional, used when saving"
							>
						</label>
						<label class="block text-sm text-slate-700">
							Timeout (seconds)
							<input
								v-model.number="timeoutSec"
								type="number"
								min="1"
								class="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							>
						</label>
					</div>
					<div class="min-h-0 flex-1 px-3 pb-3">
						<textarea
							v-model="draft"
							class="h-full min-h-0 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 font-mono text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
							placeholder="hostname&#10;or a script, one line per command"
							:disabled="running"
							@keydown="onKeydown"
						/>
					</div>
					<div class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-3 py-2">
						<label class="flex items-center gap-2 text-sm text-slate-700">
							<input
								v-model="allAtOnce"
								type="checkbox"
								class="h-4 w-4 rounded border-slate-300 text-primary-800"
							>
							<span>All at once<span class="mt-0.5 block text-xs font-normal text-slate-500">Off runs one device after another.</span></span>
						</label>
						<div class="flex flex-wrap gap-2">
							<button
								type="button"
								class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
								@click="showLibrary = !showLibrary"
							>
								Load
							</button>
							<button
								type="button"
								class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
								:disabled="!draft.trim() || !name.trim() || saving"
								@click="save"
							>
								Save
							</button>
							<button
								v-if="running"
								type="button"
								class="inline-flex min-h-11 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 hover:bg-red-100"
								@click="stop"
							>
								Stop
							</button>
							<button
								v-else
								type="button"
								class="inline-flex min-h-11 items-center rounded-lg bg-primary-800 px-4 text-sm font-medium text-white disabled:opacity-40"
								:disabled="!canRun"
								@click="run"
							>
								Run
							</button>
						</div>
					</div>
					<p
						v-if="notice"
						class="border-t border-slate-200 px-3 py-2 text-sm text-slate-600"
					>
						{{ notice }}
					</p>
					<div
						v-if="showLibrary"
						class="max-h-36 shrink-0 overflow-y-auto border-t border-slate-200 bg-white"
					>
						<p
							v-if="!saved.length"
							class="px-3 py-4 text-sm text-slate-500"
						>
							No saved commands or scripts.
						</p>
						<button
							v-for="item in saved"
							:key="`${item.kind}-${item.id}`"
							type="button"
							class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50"
							@click="loadItem(item)"
						>
							<span class="min-w-0 truncate font-medium text-slate-800">{{ item.name }}</span>
							<span class="shrink-0 text-xs uppercase text-slate-400">{{ item.kind }}</span>
						</button>
					</div>
				</div>

				<div class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm xl:col-start-2 xl:row-start-1">
					<h4 class="shrink-0 text-sm font-semibold text-gray-800">
						Targets
					</h4>
					<p class="mt-1 shrink-0 text-xs text-gray-500">
						Choose groups, devices, or both. One line runs as a command. Several lines run as a script.
					</p>
					<div class="mt-3 flex min-h-0 flex-1 flex-col">
						<p class="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
							Groups
						</p>
						<div class="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
							<label
								v-for="group in groups"
								:key="group.id"
								class="flex items-center gap-2 text-sm text-gray-700"
							>
								<input
									type="checkbox"
									class="h-4 w-4 rounded border-slate-300 text-primary-800"
									:checked="groupIds.includes(group.id)"
									@change="toggle(groupIds, group.id)"
								>
								<span class="min-w-0 truncate">{{ groupLabel(group.id) }}</span>
							</label>
							<p
								v-if="!groups.length"
								class="text-sm text-gray-400"
							>
								No groups.
							</p>
						</div>
					</div>
					<div class="mt-4 flex min-h-0 flex-1 flex-col">
						<p class="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
							Devices
						</p>
						<input
							v-model="clientQuery"
							class="mt-2 w-full shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
							placeholder="Filter devices"
							@input="scheduleClientSearch"
						>
						<div class="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
							<label
								v-for="client in orderedClients"
								:key="client.id"
								class="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-700"
								:class="clientIds.includes(client.id) ? 'bg-slate-100' : ''"
							>
								<input
									type="checkbox"
									class="h-4 w-4 rounded border-slate-300 text-primary-800"
									:checked="clientIds.includes(client.id)"
									@change="toggleClient(client)"
								>
								<span class="min-w-0 truncate">{{ client.name || client.id }}</span>
							</label>
						</div>
					</div>
				</div>

				<div class="flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-inner xl:col-span-2 xl:row-start-2">
				<div
					v-if="tabList.length"
					class="scrollbar-hide flex gap-1 overflow-x-auto border-b border-gray-800 px-2 pt-2"
				>
					<button
						v-for="pane in tabList"
						:key="pane.id"
						type="button"
						class="inline-flex shrink-0 items-center gap-2 rounded-t-md px-3 py-2 text-xs font-medium"
						:class="pane.id === activePane ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-200'"
						@click="activePane = pane.id"
					>
						<span
							class="h-2 w-2 shrink-0 rounded-full"
							:class="pane.state === 'ok' ? 'bg-emerald-400' : pane.state === 'error' ? 'bg-red-400' : 'bg-gray-500'"
						/>
						{{ pane.name }}
					</button>
				</div>
				<div
					ref="logEl"
					class="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-3"
				>
					<p
						v-show="!hasOutput"
						class="font-mono text-xs leading-5 text-gray-500"
					>
						Output appears here.
					</p>
					<pre
						ref="preEl"
						class="whitespace-pre-wrap break-all font-mono text-xs leading-5 text-gray-100"
					/>
				</div>
				</div>
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
import { apiWebSocketUrl } from '~/utils/url';
import { apiErrorMessage } from '~/lib/apiError';
import { groupLabel } from '~/lib/groupId';
import { createAnsiAppender } from '~/lib/ansi';

type SavedItem = {
	id: string;
	name: string;
	kind: 'command' | 'script';
	body: string;
	timeout_sec: number;
};

const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const token = useCookie('token');

const name = ref('');
const draft = ref('');
const timeoutSec = ref(300);
const allAtOnce = ref(true);
const running = ref(false);
const saving = ref(false);
const notice = ref('');
const showLibrary = ref(false);
const saved = ref<SavedItem[]>([]);
const savedId = ref('');
const savedKind = ref<'command' | 'script' | ''>('');
const groups = ref<{ id: string }[]>([]);
const clients = ref<{ id: string; name?: string }[]>([]);
const picked = ref<Record<string, string>>({});
const groupIds = ref<string[]>([]);
const clientIds = ref<string[]>([]);
const clientQuery = ref('');
const tabList = ref<{ id: string; name: string; state: 'pending' | 'ok' | 'error' }[]>([]);
const activePane = ref('');
const hasOutput = ref(false);
const logEl = ref<HTMLElement | null>(null);
const preEl = ref<HTMLElement | null>(null);
let socket: WebSocket | null = null;
let searchTimer = 0;
let runToken = 0;
let paintedFor = '';
let writer: ReturnType<typeof createAnsiAppender> | null = null;

type PaneState = 'pending' | 'ok' | 'error';
type PaneBuf = { id: string; name: string; text: string; streamed: boolean; state: PaneState };
const paneMap = new Map<string, PaneBuf>();
const outputLimit = 60_000;

const canRun = computed(() => Boolean(draft.value.trim()) && (clientIds.value.length > 0 || groupIds.value.length > 0));

const orderedClients = computed(() => {
	const selected = clientIds.value.map(id => ({ id, name: picked.value[id] || id }));
	const rest = clients.value.filter(client => !clientIds.value.includes(client.id));
	return [...selected, ...rest];
});

const toggle = (list: string[], id: string) => {
	const index = list.indexOf(id);
	if (index === -1) list.push(id);
	else list.splice(index, 1);
};

const toggleClient = (client: { id: string; name?: string }) => {
	toggle(clientIds.value, client.id);
	if (clientIds.value.includes(client.id)) picked.value[client.id] = client.name || client.id;
	else delete picked.value[client.id];
};

const clientLabel = (id: string, name?: string) => picked.value[id] || name || id;

const resetOutput = () => {
	paneMap.clear();
	tabList.value = clientIds.value.map((id) => {
		const label = clientLabel(id);
		paneMap.set(id, { id, name: label, text: '', streamed: false, state: 'pending' });
		return { id, name: label, state: 'pending' };
	});
	activePane.value = tabList.value[0]?.id ?? '';
	hasOutput.value = false;
	paintedFor = '';
	writer = null;
	nextTick(() => {
		if (preEl.value) createAnsiAppender(preEl.value).clear();
	});
};

const showPane = (id: string) => {
	const pre = preEl.value;
	if (!pre) return;
	writer = createAnsiAppender(pre);
	writer.clear();
	paintedFor = id;
	const text = paneMap.get(id)?.text ?? '';
	hasOutput.value = text.length > 0;
	if (text) writer.write(text);
	const box = logEl.value;
	if (box) box.scrollTop = box.scrollHeight;
};

const ensurePane = (id: string, name?: string) => {
	let pane = paneMap.get(id);
	if (!pane) {
		pane = { id, name: clientLabel(id, name), text: '', streamed: false, state: 'pending' };
		paneMap.set(id, pane);
		tabList.value = [...tabList.value, { id, name: pane.name, state: 'pending' }];
		if (!activePane.value) activePane.value = id;
	}
	else if (name && pane.name === pane.id) {
		pane.name = name;
		const tab = tabList.value.find(item => item.id === id);
		if (tab) tab.name = name;
	}
	return pane;
};

const markPane = (id: string, state: PaneState) => {
	const pane = paneMap.get(id);
	if (pane) pane.state = state;
	const tab = tabList.value.find(item => item.id === id);
	if (tab) tab.state = state;
};

const appendTo = (id: string, name: string | undefined, text: string) => {
	if (!text) return;
	const pane = ensurePane(id, name);
	pane.text += text;
	let trimmed = false;
	if (pane.text.length > outputLimit) {
		pane.text = `[earlier output omitted]\n${pane.text.slice(pane.text.length - outputLimit)}`;
		trimmed = true;
	}
	if (pane.id !== activePane.value) return;
	if (trimmed || paintedFor !== pane.id) {
		showPane(pane.id);
		return;
	}
	hasOutput.value = true;
	writer?.write(text);
	const box = logEl.value;
	if (box) box.scrollTop = box.scrollHeight;
};

watch(activePane, (id) => {
	if (!id) return;
	nextTick(() => showPane(id));
});

const loadTargets = async () => {
	try {
		const response = await $api.groups.listGroups();
		groups.value = response.data ?? [];
	}
	catch {
		groups.value = [];
	}
	await searchClients();
	await refreshLibrary();
};

const searchClients = async () => {
	try {
		const response = await $api.clients.listByGroup('all', {
			search: clientQuery.value.trim() || undefined,
			matchBy: 'word_in_word',
		});
		clients.value = response.data ?? [];
	}
	catch {
		clients.value = [];
	}
};

const scheduleClientSearch = () => {
	window.clearTimeout(searchTimer);
	searchTimer = window.setTimeout(searchClients, 250);
};

const refreshLibrary = async () => {
	const items: SavedItem[] = [];
	try {
		const commands = await $api.library.listCommand();
		for (const item of commands.data ?? []) {
			items.push({
				id: item.id,
				name: item.name,
				kind: 'command',
				body: item.cmd,
				timeout_sec: item.timeout_sec || 300,
			});
		}
	}
	catch {
		notice.value = 'Saved commands could not be loaded.';
	}
	try {
		const scripts = await $api.library.listScripts();
		for (const item of scripts.data ?? []) {
			items.push({
				id: item.id,
				name: item.name,
				kind: 'script',
				body: item.script,
				timeout_sec: item.timeout_sec || 300,
			});
		}
	}
	catch {
		notice.value = 'Saved scripts could not be loaded.';
	}
	saved.value = items.sort((a, b) => a.name.localeCompare(b.name));
};

const loadItem = (item: SavedItem) => {
	name.value = item.name;
	draft.value = item.body;
	timeoutSec.value = item.timeout_sec || 300;
	savedId.value = item.id;
	savedKind.value = item.kind;
	showLibrary.value = false;
	notice.value = '';
};

const save = async () => {
	const body = draft.value.replace(/\s+$/, '');
	if (!body || !name.value.trim()) return;
	saving.value = true;
	notice.value = '';
	const kind = body.includes('\n') ? 'script' : 'command';
	const timeout = Number(timeoutSec.value) || 300;
	try {
		if (kind === 'command') {
			const payload = { name: name.value.trim(), cmd: body, tags: [], timeout_sec: timeout };
			if (savedId.value && savedKind.value === 'command') await $api.library.updateCommand(savedId.value, payload);
			else {
				const created = await $api.library.createCommand(payload);
				savedId.value = created.data.id;
				savedKind.value = 'command';
			}
		}
		else {
			const payload = {
				name: name.value.trim(),
				script: body,
				tags: [],
				timeout_sec: timeout,
				cwd: '',
				is_sudo: false,
				interpreter: '',
			};
			if (savedId.value && savedKind.value === 'script') await $api.library.updateScript(savedId.value, payload);
			else {
				const created = await $api.library.createScript(payload);
				savedId.value = created.data.id;
				savedKind.value = 'script';
			}
		}
		notice.value = 'Saved.';
		await refreshLibrary();
	}
	catch (error) {
		notice.value = apiErrorMessage(error, 'Could not save.');
	}
	finally {
		saving.value = false;
	}
};

function toBase64(value: string) {
	const bytes = new TextEncoder().encode(value);
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}

const handleFrame = (raw: string) => {
	if (raw.length > 32_000) {
		const id = raw.match(/"client_id"\s*:\s*"([^"]+)"/)?.[1];
		const status = raw.match(/"status"\s*:\s*"([^"]+)"/)?.[1];
		if (id && status) markPane(id, status === 'successful' ? 'ok' : status === 'running' ? 'pending' : 'error');
		if (id && paneMap.get(id)?.streamed) return;
		if (raw.length > 120_000) {
			appendTo(id || 'general', undefined, '\n[output too large to show in full]\n');
			if (id && status !== 'successful') markPane(id, 'error');
			return;
		}
	}
	let data: { status?: string; error?: string; errors?: { detail?: string; title?: string }[]; client_id?: string; client_name?: string; result?: { stdout?: string; stderr?: string } };
	try {
		data = JSON.parse(raw);
	}
	catch {
		appendTo(activePane.value || 'general', 'General', raw);
		return;
	}
	const id = data.client_id || 'general';
	const name = data.client_name || (id === 'general' ? 'General' : undefined);
	const pane = ensurePane(id, name);
	if (!data.status && (data.result?.stdout || data.result?.stderr)) pane.streamed = true;
	if (data.status && pane.streamed && raw.length > 32_000) return;
	const failure = data.error || data.errors?.map(item => item.detail || item.title).filter(Boolean).join('\n');
	if (failure) {
		markPane(id, 'error');
		appendTo(id, name, failure.endsWith('\n') ? failure : `${failure}\n`);
	}
	if (!pane.streamed || !data.status) {
		if (data.result?.stdout) appendTo(id, name, data.result.stdout);
		if (data.result?.stderr) appendTo(id, name, data.result.stderr);
	}
	if (data.status) {
		if (data.status === 'successful') markPane(id, 'ok');
		else if (data.status !== 'running') markPane(id, 'error');
		appendTo(id, name, data.status.endsWith('\n') ? data.status : `${data.status}\n`);
	}
};

const run = () => {
	const body = draft.value.replace(/\s+$/, '');
	if (!canRun.value || running.value) return;
	const generation = ++runToken;
	resetOutput();
	notice.value = '';
	running.value = true;
	const multiline = body.includes('\n');
	const path = multiline ? '/api/v1/ws/scripts' : '/api/v1/ws/commands';
	const shared = {
		client_ids: [...clientIds.value],
		group_ids: [...groupIds.value],
		timeout_sec: Number(timeoutSec.value) || 300,
		execute_concurrently: allAtOnce.value,
		is_sudo: false,
	};
	const payload = multiline
		? { ...shared, script: toBase64(body), cwd: '' }
		: { ...shared, command: body };
	const ws = new WebSocket(apiWebSocketUrl(config.public.apiUrl, path, token.value));
	socket = ws;
	const inbox: string[] = [];
	let pumping = false;
	const pump = () => {
		if (generation !== runToken) {
			inbox.length = 0;
			pumping = false;
			return;
		}
		const started = performance.now();
		let count = 0;
		while (inbox.length && count < 4 && performance.now() - started < 6) {
			handleFrame(inbox.shift() ?? '');
			count += 1;
		}
		if (inbox.length && generation === runToken) window.setTimeout(pump, 24);
		else pumping = false;
	};
	ws.onopen = () => ws.send(JSON.stringify(payload));
	ws.onmessage = (event) => {
		if (generation !== runToken) return;
		const raw = typeof event.data === 'string' ? event.data : '';
		if (inbox.length >= 48) {
			const dropAt = inbox.findIndex(item => item.length < 32_000 && !item.includes('"status"'));
			if (dropAt === -1) return;
			inbox.splice(dropAt, 1);
		}
		inbox.push(raw);
		if (pumping) return;
		pumping = true;
		window.setTimeout(pump, 0);
	};
	ws.onerror = () => {
		if (generation !== runToken) return;
		appendTo(activePane.value || 'general', 'General', 'Could not reach the server.\n');
		running.value = false;
	};
	ws.onclose = () => {
		if (generation !== runToken) return;
		running.value = false;
		socket = null;
	};
};

const stop = () => {
	runToken += 1;
	socket?.close();
	socket = null;
	running.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		run();
	}
};

onMounted(loadTargets);
onBeforeUnmount(stop);
</script>
