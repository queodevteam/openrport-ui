import { apiWebSocketUrl } from '~/utils/url';

export const useCommandExecution = () => {
	const config = useRuntimeConfig();
	const userAuth = useCookie('token');
	let ws: WebSocket | null = null;
	const results = ref<any[]>([]);
	const isConnected = ref(false);
	const error = ref<string | null>(null);
	const isLoading = ref(false);

	const executeCommand = (command: string, clientsIds: string[], groupIds: string[]) => {
		const wsUrl = apiWebSocketUrl(config.public.apiUrl, '/api/v1/ws/commands', userAuth.value);
		ws = new WebSocket(wsUrl);
		isLoading.value = true;
		const requestPayload = {
			command,
			client_ids: clientsIds,
			group_ids: groupIds,
			timeout_sec: 30,
			execute_concurrently: true,
			is_sudo: false,
		};
		ws.onopen = () => {
			results.value = [];
			ws?.send(JSON.stringify(requestPayload));
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			results.value.push(data);
			isLoading.value = false;
		};
		ws.onerror = (err) => {
			error.value = 'WebSocket error occurred.';
			isLoading.value = false;
			ws?.close();
		};
		ws.onclose = (event) => {
			isLoading.value = false;
		};
	};

	const disconnect = () => {
		if (ws) {
			ws.close();
		}
	};

	return { executeCommand, disconnect, isLoading, results, isConnected, error };
};
