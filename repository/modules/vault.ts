import { HttpFactory, HttpMethod } from '~/repository/factory';

export type VaultStatus = {
	init?: string;
	status?: string;
};

export type VaultKey = {
	id: number;
	client_id?: string;
	key: string;
	created_by?: string;
	created_at?: string;
};

class VaultModule extends HttpFactory {
	async status(): Promise<{ data: VaultStatus }> {
		return this.call('GET', '/api/v1/vault-admin', undefined);
	}

	async init(password: string): Promise<unknown> {
		return this.call(HttpMethod.POST, '/api/v1/vault-admin/init', { password });
	}

	async unlock(password: string): Promise<unknown> {
		return this.call(HttpMethod.POST, '/api/v1/vault-admin/sesame', { password });
	}

	async lock(): Promise<unknown> {
		return this.call(HttpMethod.DELETE, '/api/v1/vault-admin/sesame', undefined);
	}

	async list(): Promise<{ data: VaultKey[] }> {
		return this.call('GET', '/api/v1/vault', undefined);
	}
}

export default VaultModule;
