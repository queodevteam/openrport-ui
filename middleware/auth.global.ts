import { hasSessionToken } from '~/composables/useSessionAuth';

export default defineNuxtRouteMiddleware((to) => {
	const store = useTokenStore();
	const { authenticated } = storeToRefs(store);
	const loggedIn = hasSessionToken() || authenticated.value;

	if (loggedIn) {
		authenticated.value = true;
	}

	if (loggedIn && to?.name === 'auth') {
		return navigateTo('/dashboard');
	}
	if (!loggedIn && to?.name !== 'auth') {
		return navigateTo('/auth');
	}
});
