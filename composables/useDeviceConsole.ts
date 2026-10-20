import { apiWebSocketUrl } from '~/utils/url';

type JobMessage = {
	status?: string;
	error?: string;
	errors?: { title?: string; detail?: string }[];
	command?: string;
	pid?: number;
	result?: { stdout?: string; stderr?: string };
};

function toBase64(value: string) {
	const bytes = new TextEncoder().encode(value);
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}

function errorText(data: JobMessage) {
	if (data.error) return data.error;
	const parts = (data.errors ?? []).map(item => item.detail || item.title).filter(Boolean);
	return parts.join('\n');
}

export function useDeviceConsole() {
	const config = useRuntimeConfig();
	const userAuth = useCookie('token');
	const { $api } = useNuxtApp();
	const running = ref(false);
	let socket: WebSocket | null = null;
	let runId = 0;
	let activeCommand = '';
	let activeClientId = '';
	let sink: ((text: string, reset: boolean) => void) | null = null;

	const bindOutput = (next: (text: string, reset: boolean) => void) => {
		sink = next;
	};

	const clearOutput = () => {
		sink?.('', true);
	};

	const append = (text: string) => {
		if (!text) return;
		const cap = 200_000;
		sink?.(text.length > cap ? text.slice(text.length - cap) : text, false);
	};

	const finish = (id: number) => {
		if (id !== runId) return;
		running.value = false;
		socket = null;
	};

	const openSocket = (path: string, payload: object) => {
		const wsUrl = apiWebSocketUrl(config.public.apiUrl, path, userAuth.value);
		const ws = new WebSocket(wsUrl);
		ws.onopen = () => ws.send(JSON.stringify(payload));
		return ws;
	};

	const lookupPid = async (clientId: string, command: string) => {
		for (let attempt = 0; attempt < 8; attempt += 1) {
			try {
				const response = await $api.clients.runningJobs(clientId);
				const match = (response.data ?? []).find(job => job.pid && job.command?.trim() === command.trim());
				if (match?.pid) return match.pid;
			}
			catch {
				return null;
			}
			await new Promise(resolve => setTimeout(resolve, 250));
		}
		return null;
	};

	const sendInterrupt = (clientId: string, pid: number) => {
		const snippet = `kill -INT ${pid}; for c in $(ps -o pid= --ppid ${pid}); do kill -INT $c; done`;
		const payload = {
			command: snippet,
			client_ids: [clientId],
			group_ids: [],
			timeout_sec: 15,
			execute_concurrently: true,
			is_sudo: false,
		};
		const ws = openSocket('/api/v1/ws/commands', payload);
		window.setTimeout(() => ws.close(), 4000);
	};

	const run = (clientId: string, text: string) => {
		const command = text.replace(/\s+$/, '');
		if (!command || running.value || !clientId) return;
		const id = ++runId;
		activeCommand = command;
		activeClientId = clientId;
		running.value = true;
		clearOutput();
		append(`$ ${command}\n`);
		const multiline = command.includes('\n');
		const path = multiline ? '/api/v1/ws/scripts' : '/api/v1/ws/commands';
		const payload = multiline
			? {
				script: toBase64(command),
				client_ids: [clientId],
				group_ids: [],
				timeout_sec: 300,
				cwd: '',
				execute_concurrently: true,
				is_sudo: false,
			}
			: {
				command,
				client_ids: [clientId],
				group_ids: [],
				timeout_sec: 300,
				execute_concurrently: true,
				is_sudo: false,
			};
		let streamed = false;
		let pumping = false;
		const inbox: string[] = [];
		const frameLimit = 32_000;
		const maxInbox = 80;
		const ws = openSocket(path, payload);
		socket = ws;

		const handleFrame = (raw: string) => {
			if (id !== runId) return;
			if (raw.length > frameLimit && streamed) {
				if (raw.includes('"status"')) finish(id);
				return;
			}
			let data: JobMessage;
			try {
				data = JSON.parse(raw);
			}
			catch {
				append(`${raw.slice(-2_000)}\n`);
				return;
			}
			const failure = errorText(data);
			if (data.errors?.length) {
				append(`${failure || 'Command failed.'}\n`);
				finish(id);
				return;
			}
			const stdout = data.result?.stdout ?? '';
			const stderr = data.result?.stderr ?? '';
			if (!data.status) {
				if (stdout) {
					streamed = true;
					append(stdout);
				}
				if (stderr) {
					streamed = true;
					append(stderr);
				}
				return;
			}
			if (!streamed) {
				if (stdout) append(stdout.endsWith('\n') ? stdout : `${stdout}\n`);
				if (stderr) append(stderr.endsWith('\n') ? stderr : `${stderr}\n`);
			}
			if (failure && data.status !== 'successful') append(`${failure}\n`);
			finish(id);
		};

		const pump = () => {
			if (id !== runId) {
				pumping = false;
				inbox.length = 0;
				return;
			}
			const started = performance.now();
			let count = 0;
			while (inbox.length && count < 30 && performance.now() - started < 8) {
				handleFrame(inbox.shift() ?? '');
				count += 1;
			}
			if (inbox.length && id === runId) window.setTimeout(pump, 0);
			else pumping = false;
		};

		ws.onmessage = (event) => {
			if (id !== runId) return;
			const raw = typeof event.data === 'string' ? event.data : '';
			if (inbox.length >= maxInbox) {
				const dropAt = inbox.findIndex(item => !item.includes('"status"'));
				if (dropAt === -1) return;
				inbox.splice(dropAt, 1);
			}
			inbox.push(raw);
			if (pumping) return;
			pumping = true;
			window.setTimeout(pump, 0);
		};
		ws.onerror = () => {
			if (id !== runId) return;
			append('Could not reach the device.\n');
			finish(id);
		};
		ws.onclose = () => {
			if (id !== runId) return;
			if (running.value) finish(id);
		};
	};

	const stop = async () => {
		if (!running.value) return;
		const id = runId;
		const clientId = activeClientId;
		const command = activeCommand;
		runId += 1;
		socket?.close();
		socket = null;
		running.value = false;
		const pid = await lookupPid(clientId, command);
		if (pid) {
			sendInterrupt(clientId, pid);
			append('[interrupted]\n');
		}
		else {
			append('[could not interrupt the process]\n');
		}
		finish(id);
	};

	return { running, bindOutput, run, stop };
}
