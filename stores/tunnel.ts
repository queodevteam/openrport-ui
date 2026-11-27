import { defineStore } from 'pinia';
import type { TunnelPayload } from '~/types';

export const useTunnelStore = defineStore('tunnel', {
	state: () => ({
		isAddingTunnel: false,
	}),

	actions: {
		openAddTunel() {
			this.isAddingTunnel = true;
		},
		async createTunnel(clientID: string, payload: TunnelPayload) {
			const { $api } = useNuxtApp();
			try {
				const data = await $api.clients.createTunnel(clientID, payload);
				return { data: data, error: null };
			}
			catch (error: unknown) {
				return {
					data: null,
					error: error ?? { errors: [{ title: 'Could not start the tunnel.' }] },
				};
			}
		},
		closeAddTunnel() {
			this.isAddingTunnel = false;
		},
	},
});
