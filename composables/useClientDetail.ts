export const useClientDetail = () => {
	const route = useRoute();
	const clientStore = useClientStore();
	const { currentClient: device, currentMetrics: metrics } = storeToRefs(clientStore);
	const deviceId = computed(() => route.params.id);

	watch(deviceId, (id) => {
		if (typeof id === 'string' && id) {
			clientStore.loadClientById(id);
		}
	}, { immediate: true });

	return {
		deviceId,
		clientStore,
		device,
		metrics,
	};
};
