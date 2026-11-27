import { nextTick } from 'vue';
import { defineStore } from 'pinia';
import type { ILoginInput, TwoFa } from '~/types';
import {
	clearSessionToken,
	writeSessionToken,
} from '~/composables/useSessionAuth';

function loginErrorMessage(error: any): string {
	const status = error?.statusCode || error?.status || error?.response?.status;
	const data = error?.data ?? error?.response?._data ?? error?.response?.data;
	const apiErrors = data?.errors;
	if (Array.isArray(apiErrors) && apiErrors.length > 0) {
		const msg = apiErrors[0].detail || apiErrors[0].title;
		if (msg) return status ? `${msg} (${status})` : msg;
	}
	if (status === 429) return 'Too many requests. Wait a minute or ask to restart rportd.';
	if (status === 401) return 'Invalid username or password.';
	if (error?.message) return String(error.message);
	return 'An error occurred. Please try again later.';
}

function extractLoginPayload(response: any): { token?: string; two_fa?: TwoFa | null } {
	const root = response?.data ?? response;
	if (!root || typeof root !== 'object') return {};
	if (root.data && typeof root.data === 'object' && ('token' in root.data || 'two_fa' in root.data)) {
		return {
			token: root.data.token ?? undefined,
			two_fa: root.data.two_fa ?? null,
		};
	}
	if ('token' in root || 'two_fa' in root) {
		return {
			token: root.token ?? undefined,
			two_fa: root.two_fa ?? null,
		};
	}
	return {};
}

export const useTokenStore = defineStore('token', {
	state: () => ({
		authenticated: false,
		showTwoFa: false,
		loading: false,
		errors: [] as Array<string>,
		two_fa: {} as TwoFa,
		twoFaToken: null as string,
	}),
	actions: {
		async getLoginToken(credentials: ILoginInput) {
			const { $api } = useNuxtApp();
			this.loading = true;
			this.errors = [];
			try {
				const response = await $api.auth.login(credentials);
				const { token: accessToken, two_fa: twoFa } = extractLoginPayload(response);
				if (!accessToken) {
					this.errors = ['Login returned 200 but no token. Check the Network response body.'];
					this.loading = false;
					return false;
				}
				const needsTwoFa = Boolean(
					twoFa
					&& typeof twoFa === 'object'
					&& (twoFa.delivery_method || twoFa.send_to),
				);
				if (needsTwoFa) {
					this.twoFaToken = accessToken;
					this.two_fa = twoFa as TwoFa;
					this.showTwoFa = true;
					this.loading = false;
					return false;
				}
				writeSessionToken(accessToken, credentials.remember_me || '3600');
				this.authenticated = true;
				this.showTwoFa = false;
				await nextTick();
				this.loading = false;
				return true;
			}
			catch (error: any) {
				this.errors = [loginErrorMessage(error)];
				this.loading = false;
				return false;
			}
		},
		async verifyTwoFa(credentials: ILoginInput, code: string) {
			const { $api } = useNuxtApp();
			this.loading = true;
			this.errors = [];
			try {
				const response = await $api.auth.verify2fa(credentials, this.twoFaToken, code);
				const { token: accessToken } = extractLoginPayload(response);
				if (!accessToken) {
					this.errors = ['2FA succeeded but no token was returned.'];
					this.loading = false;
					return false;
				}
				writeSessionToken(accessToken, credentials.remember_me || '3600');
				this.authenticated = true;
				this.showTwoFa = false;
				await nextTick();
				this.loading = false;
				return true;
			}
			catch (error: any) {
				this.errors = [loginErrorMessage(error)];
				this.loading = false;
				return false;
			}
		},

		async getProvider() {

		},
		async logOut() {
			const { $api } = useNuxtApp();
			try {
				await $api.auth.logout();
			}
			catch {
				// La sesión local se cierra aunque el servidor ya no acepte el token.
			}
			this.authenticated = false;
			clearSessionToken();
		},
	},
});
