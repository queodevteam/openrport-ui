import { $fetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';
import AuthModule from '~/repository/modules/auth';
import ClientsModule from '~/repository/modules/clients';
import GroupsModule from '~/repository/modules/groups';
import UsersModule from '~/repository/modules/users';
import UserGroupsModule from '~/repository/modules/user-groups';
import ProfileModule from '~/repository/modules/profile';
import ClientAuthModule from '~/repository/modules/client-auth';
import StatusModule from '~/repository/modules/status';
import TunnelsModule from '~/repository/modules/tunnels';
import LibraryModule from '~/repository/modules/library';
import VaultModule from '~/repository/modules/vault';
import AuditModule from '~/repository/modules/audit';
import { clearSessionToken, readSessionToken } from '~/composables/useSessionAuth';

interface IApiInstance {
	auth: AuthModule;
	clients: ClientsModule;
	groups: GroupsModule;
	users: UsersModule;
	userGroups: UserGroupsModule;
	profile: ProfileModule;
	clientAuth: ClientAuthModule;
	status: StatusModule;
	tunnels: TunnelsModule;
	library: LibraryModule;
	vault: VaultModule;
	audit: AuditModule;
}

function resolveApiUrl(): string {
	const config = useRuntimeConfig();
	const fromRuntime = String(config.public.apiUrl || '').trim();
	const fromWindow = import.meta.client
		? String(window.__RPORT_CONFIG__?.apiUrl || '').trim()
		: '';
	const configured = fromWindow || fromRuntime;
	if (!configured || configured === 'same-origin') {
		if (import.meta.client) return window.location.origin;
		return '';
	}
	return configured;
}

export default defineNuxtPlugin(() => {
	const apiUrl = resolveApiUrl();
	// rportd AllowedHeaders is only Authorization + Content-Type.
	const stripAccept = (options: FetchOptions) => {
		const headers = new Headers(options.headers as HeadersInit);
		headers.delete('Accept');
		options.headers = headers;
		return headers;
	};
	const fetchOptions: FetchOptions = {
		baseURL: apiUrl,
		onRequest({ options }) {
			stripAccept(options);
		},
	};
	const apiFetchOptions: FetchOptions = {
		baseURL: apiUrl,
		onRequest({ options }) {
			const headers = stripAccept(options);
			const token = readSessionToken();
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
			else {
				headers.delete('Authorization');
			}
			options.headers = headers;
		},
		onRequestError({ request, error }): void | Promise<void> {
			console.log('[fetch request error]', request, error);
		},
		async onResponseError({ response }): void | Promise<void> {
			if (response.status === 401) {
				clearSessionToken();
				const store = useTokenStore();
				store.authenticated = false;
				await navigateTo('/auth');
			}
		},
	};
	const authFetcher = $fetch.create(fetchOptions);
	const apiFetcher = $fetch.create(apiFetchOptions);
	const modules: IApiInstance = {
		auth: new AuthModule(authFetcher),
		clients: new ClientsModule(apiFetcher),
		groups: new GroupsModule(apiFetcher),
		users: new UsersModule(apiFetcher),
		userGroups: new UserGroupsModule(apiFetcher),
		profile: new ProfileModule(apiFetcher),
		clientAuth: new ClientAuthModule(apiFetcher),
		status: new StatusModule(apiFetcher),
		tunnels: new TunnelsModule(apiFetcher),
		library: new LibraryModule(apiFetcher),
		vault: new VaultModule(apiFetcher),
		audit: new AuditModule(apiFetcher),
	};

	return {
		provide: {
			api: modules,
		},
	};
});
