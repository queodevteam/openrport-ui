<template>
	<new-page-wrapper is-extra="true">
		<div class="flex min-h-0 flex-1 flex-col xl:flex-row xl:overflow-hidden">
			<new-devices-sidebar :accordion-items="accordionItems" />
			<div
				class="min-h-0 flex-1"
				:class="route.params.id ? 'flex' : 'hidden xl:block'"
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
		accordionItems.value.push({ title: group.id, id: group.id, content: `${group.description} - (${group.num_clients})` });
	});
};
</script>
