<template>
	<new-page-wrapper is-extra="true">
		<div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
			<new-devices-sidebar :accordion-items="accordionItems" />
			<div
				class="h-full min-h-0 flex-1 overflow-hidden"
				:class="route.params.id ? 'flex flex-col' : 'hidden xl:block'"
			>
				<NuxtPage />
			</div>
		</div>
	</new-page-wrapper>
</template>

<script setup lang="ts">
const route = useRoute();
const clientStore = useClientStore();
const accordionItems = ref([
	{ title: 'All', content: 'Content for item 1' },
	{ title: 'Favorites', content: 'Content for item 2' },
]);

onBeforeMount(async () => {
	await clientStore.loadGroups();
	updateGroupsItems();
});
const updateGroupsItems = () => {
	accordionItems.value = [];
	accordionItems.value.push({ title: 'All', content: 'Content for item 1', id: 'all' });
	accordionItems.value.push({ title: 'Favorites', content: 'Content for item 2', id: 'favorites' });

	clientStore.groups.forEach((group) => {
		accordionItems.value.push({
			title: group.id,
			id: group.id,
			count: group.num_clients,
			content: `${group.description} - (${group.num_clients})`,
		});
	});
};

watch(() => clientStore.listRevision, () => {
	updateGroupsItems();
});
</script>
