<template>
	<LoginForm
		v-if="!showTwoFa"
		@login="handleLogin"
	/>
	<TwoFa
		v-if="showTwoFa"
		:send_to="store.two_fa?.send_to"
		@code="handleTwoFa"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '../components/LoginForm.vue';
import type { ILoginInput } from '~/types';

const store = useTokenStore();
const { authenticated, showTwoFa } = storeToRefs(store);
const credentialsRef = ref<ILoginInput>({
	username: '',
	password: '',
	remember_me: '',
});

definePageMeta({
	layout: 'auth',
});

const goDashboard = async () => {
	// Full navigation so middleware reads the cookie from a clean load.
	// Soft navigateTo can race useCookie and bounce straight back to /auth.
	if (import.meta.client) {
		window.location.replace('/dashboard');
		return;
	}
	await navigateTo('/dashboard', { replace: true });
};

const handleLogin = async (credentials: ILoginInput) => {
	credentialsRef.value = credentials;
	const ok = await store.getLoginToken(credentials);
	if (ok && authenticated.value && !showTwoFa.value) {
		await goDashboard();
	}
};

const handleTwoFa = async (two_fa: string) => {
	const ok = await store.verifyTwoFa(credentialsRef.value, two_fa);
	if (ok && authenticated.value) {
		await goDashboard();
	}
};
</script>
