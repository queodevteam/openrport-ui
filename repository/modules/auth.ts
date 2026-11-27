import type { FetchOptions } from 'ofetch';
import { FetchError } from 'ofetch';
import { HttpFactory, ApiResponse } from '~/repository/factory';
import type { ApiLoginResponse, ILoginInput, ILoginResponse } from '~/types';
import { readSessionToken } from '~/composables/useSessionAuth';

class AuthModule extends HttpFactory {
	private RESOURCE = '/api/v1/login';

	async login(credentials: ILoginInput): Promise<ApiLoginResponse> {
		// btoa() throws on non-Latin1 passwords; encode as UTF-8 first.
		const basic = btoa(unescape(encodeURIComponent(`${credentials.username}:${credentials.password}`)));
		const lifetime = credentials.remember_me || '3600';
		const fetchOptions: FetchOptions<'json'> = {
			headers: {
				Authorization: `Basic ${basic}`,
			},
		};
		return this.call<ApiLoginResponse>(
			'GET',
			`${this.RESOURCE}?token-lifetime=${lifetime}`,
			undefined,
			fetchOptions,
		);
	}

	async provider(): Promise<any> {
		return this.call<any>(
			'GET',
			'api/v1/provider',
			undefined,
		);
	}

	async logout(): Promise<any> {
		const token = readSessionToken();
		const fetchOptions: FetchOptions<'json'> = {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		};
		return this.call<any>(
			'DELETE',
			'/api/v1/logout',
			undefined,
			fetchOptions,
		);
	}

	async verify2fa(credentials: ILoginInput, token: string, twofaToken: string): Promise<ApiLoginResponse> {
		const fetchOptions: FetchOptions<'json'> = {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};
		return this.call<ApiLoginResponse>(
			'POST',
			`api/v1/verify-2fa?token-lifetime=${credentials.remember_me}`,
			{
				username: credentials.username,
				token: twofaToken,
			},
			fetchOptions,
		);
	}
}

export default AuthModule;
