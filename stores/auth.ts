import { nextTick } from 'vue';
import { defineStore } from 'pinia';
import type { ILoginInput, TwoFa } from '~/types';

function sessionCookieOptions(lifetimeSeconds: string) {
	const seconds = Number(lifetimeSeconds);
	const options: { path: string; sameSite: 'lax'; secure?: boolean; maxAge?: number } = {
		path: '/',
		sameSite: 'lax',
	};
	if (import.meta.client && window.location.protocol === 'https:') {
		options.secure = true;
	}
	if (Number.isFinite(seconds) && seconds > 0) {
		options.maxAge = Math.floor(seconds);
	}
	return options;
}

function persistSessionCookie(name: string, value: string, lifetimeSeconds: string) {
	if (!import.meta.client) return;
	const seconds = Number(lifetimeSeconds);
	const maxAge = Number.isFinite(seconds) && seconds > 0 ? `; Max-Age=${Math.floor(seconds)}` : '';
	const secure = window.location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function loginErrorMessage(error: any): string {
	const data = error?.data ?? error?.response?._data ?? error?.response?.data;
	const apiErrors = data?.errors;
	if (Array.isArray(apiErrors) && apiErrors.length > 0) {
		return apiErrors[0].detail || apiErrors[0].title || 'An error occurred. Please try again later.';
	}
	return 'An error occurred. Please try again later.';
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
			const cookieOptions = sessionCookieOptions(credentials.remember_me);
			const token = useCookie<string>('token', cookieOptions);
			const is_authenticated = useCookie<boolean>('is_authenticated', cookieOptions);
			try {
				const response = await $api.auth.login(credentials);
				if (response?.data.token) {
					if (response?.data?.two_fa !== null) {
						this.twoFaToken = response.data.token;
						this.two_fa = response.data.two_fa;
						this.showTwoFa = true;
					}
					else {
						token.value = response.data.token;
						is_authenticated.value = true;
						this.authenticated = true;
						await nextTick();
						persistSessionCookie('token', response.data.token, credentials.remember_me);
						persistSessionCookie('is_authenticated', 'true', credentials.remember_me);
					}
				}
				this.loading = false;
			}
			catch (error: any) {
				this.errors = [loginErrorMessage(error)];
				this.loading = false;
			}
		},
		async verifyTwoFa(credentials: ILoginInput, code: string) {
			const { $api } = useNuxtApp();
			this.loading = true;
			this.errors = [];
			const cookieOptions = sessionCookieOptions(credentials.remember_me);
			const token = useCookie<string>('token', cookieOptions);
			const is_authenticated = useCookie<boolean>('is_authenticated', cookieOptions);
			try {
				const response = await $api.auth.verify2fa(credentials, this.twoFaToken, code);
				if (response?.data.token) {
					token.value = response.data.token;
					is_authenticated.value = true;
					this.authenticated = true;
					await nextTick();
					persistSessionCookie('token', response.data.token, credentials.remember_me);
					persistSessionCookie('is_authenticated', 'true', credentials.remember_me);
				}
				this.loading = false;
			}
			catch (error: any) {
				this.errors = [loginErrorMessage(error)];
				this.loading = false;
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
			const token = useCookie('token');
			const is_authenticated = useCookie<boolean>('is_authenticated');
			this.authenticated = false;
			token.value = null;
			is_authenticated.value = false;
		},
	},
});
