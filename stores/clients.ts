import { defineStore } from 'pinia';
import type { Client, ClientGroup, ClientMetric, ClientsResponse } from '~/types';
import type { ClientSearch } from '~/repository/modules/clients';

export const useClientStore = defineStore('clients', {
	state: () => ({
		clients: [] as Array<Client>,
		groups: [] as Array<ClientGroup>,
		knownClients: {} as Record<string, Client>,
		currentClient: {} as Client,
		currentMetrics: [] as Array<ClientMetric>,
		clientLoadSeq: 0,
	}),
	getters: {
		getClients(state) {
			return state.clients;
		},
		getCurrentClient(state) {
			return state.currentClient;
		},
		getCurrentMetrics(state) {
			return state.currentMetrics;
		},
	},
	actions: {

		async loadClients() {
			try {
				const data: ClientsResponse = (await this.fetchClients()) as ClientsResponse;
				if (data) {
					this.clients = <Client[]>data.data;
				}
			}
			catch (error) {
				console.error('Error loading clients:', error);
			}
		},
		async loadGroups() {
			const { $api } = useNuxtApp();
			const data = await $api.groups.listGroups();

			this.$state.groups = <ClientGroup[]>data.data;
		},

		rememberClient(client: Client) {
			if (!client?.id) return;
			const previous = this.knownClients[client.id] ?? this.knownClients[client.id.toLowerCase()];
			const merged = previous ? { ...previous, ...client } : client;
			this.knownClients[client.id] = merged;
			const lowerId = client.id.toLowerCase();
			if (lowerId !== client.id) {
				this.knownClients[lowerId] = merged;
			}
		},

		rememberClients(clients: Client[]) {
			for (const client of clients) {
				this.rememberClient(client);
			}
		},

		async loadGroupList(id: string, filter?: ClientSearch) {
			const { $api } = useNuxtApp();
			const data = await $api.clients.listByGroup(id, filter);
			const clients = data.data ?? [];
			this.rememberClients(clients);
			return clients;
		},
		async fetchClients() {
			const { $api } = useNuxtApp();
			try {
				return await $api.clients.listClients();
			}
			catch (e) {
				console.error('Error fetching clients:', e);
			}
		},
		async loadClientById(clientId: string) {
			const { $api } = useNuxtApp();
			const seq = ++this.clientLoadSeq;
			const known = this.knownClients[clientId] ?? this.knownClients[clientId.toLowerCase()];
			this.currentClient = known ? { ...known } : { id: clientId } as Client;
			this.currentMetrics = [];

			await Promise.allSettled([
				$api.clients.show(clientId).then((data) => {
					if (seq !== this.clientLoadSeq) return;
					const client = <Client>data.data;
					this.rememberClient(client);
					this.currentClient = client;
				}).catch((error) => {
					console.error('Error fetching client:', error);
				}),
				$api.clients.metrics(clientId).then((data) => {
					if (seq !== this.clientLoadSeq) return;
					this.currentMetrics = <ClientMetric[]>data.data;
				}).catch((error) => {
					console.error('Error fetching client metrics:', error);
				}),
			]);
		},
		updateClient(client: Partial<Client>) {
			this.$state.currentClient = {
				...client,
				...this.$state.currentClient,
			};
		},
	},
});
