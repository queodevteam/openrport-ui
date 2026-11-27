<template>
	<no-clients v-if="ready && nbclient === 0" />
	<no-client-selected v-else-if="ready" />
</template>

<script setup lang="ts">
const statusStore = useStatusStore();
const ready = ref(false);
const nbclient = ref(0);
onBeforeMount(async () => {
	await statusStore.fetchNbClients();
	nbclient.value = statusStore.nbClient;
	ready.value = true;
});
</script>
