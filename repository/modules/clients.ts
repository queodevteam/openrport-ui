import { HttpFactory } from '~/repository/factory';
import type {
	ClientMetricsResponse,
	ClientResponse,
	ClientsResponse,
	Client,
	StoredTunnel, StoredTunnelResponse,
	Tunnel, TunnelPayload,
	TunnelResponse,
} from '~/types';
import { toQueryString } from '~/lib/utils';

export type ClientSearch = {
	search?: string;
	matchBy?: 'begins_with' | 'ends_with' | 'exact' | 'word_in_word';
	connectionState?: 'any' | 'connected' | 'disconnected';
};

function withClientSearchWildcard(term: string, matchBy?: ClientSearch['matchBy']) {
	if (matchBy === 'ends_with') return `*${term}`;
	if (matchBy === 'exact') return term;
	if (matchBy === 'begins_with') return `${term}*`;
	return `*${term}*`;
}

class ClientsModule extends HttpFactory {
	private RESOURCE = '/api/v1/clients';

	async show(id: string): Promise<ClientResponse> {
		return this.call<ClientResponse>(
			'GET',
			`${this.RESOURCE}/${id.toLowerCase()}`,
			undefined,
		);
	}

	async listClients(): Promise<ClientsResponse> {
		return this.call<ClientsResponse>('GET',
			`${this.RESOURCE}?sort=name&fields[clients]=id,name,os,os_family,os_kernel,os_full_name,ipv4,disconnected_at,tags&page[limit]=20&page[offset]=0`,
			undefined,
		);
	}

	async getClientsName(clientsIds: Array<string>): Promise<ClientsResponse> {
		return this.call<ClientsResponse>('GET',
			`${this.RESOURCE}?sort=name&fields[clients]=name,id&page[limit]=${clientsIds.length}&page[offset]=0&filter[id]=${clientsIds.join(',')}`,
			undefined,
		);
	}

	async listByGroup(id: string, filter?: ClientSearch): Promise<ClientsResponse> {
		const params = new URLSearchParams({
			sort: 'name',
			'fields[clients]': 'id,name,os,os_family,os_kernel,os_full_name,ipv4,disconnected_at,tags',
			'page[limit]': '100',
			'page[offset]': '0',
		});
		if (id !== 'all' && id !== 'favorites') {
			params.set('filter[groups]', id);
		}
		const term = filter?.search?.trim();
		if (term) {
			params.set('filter[name|id|ipv4]', withClientSearchWildcard(term, filter?.matchBy));
		}
		if (filter?.connectionState && filter.connectionState !== 'any') {
			params.set('filter[connection_state]', filter.connectionState);
		}
		return this.call(
			'GET',
			`${this.RESOURCE}?${params.toString()}`,
			undefined,
		);
	}

	async getTotalClients(): Promise<ClientsResponse> {
		return this.call(
			'GET',
			`${this.RESOURCE}?page[limit]=1`,
			undefined,
		);
	}

	async metrics(id: string): Promise<ClientMetricsResponse> {
		return this.call(
			'GET',
			`${this.RESOURCE}/${id}/metrics`,
			undefined,
		);
	}

	async tunnels(id: string): Promise<Tunnel[]> {
		const response = await this.call<TunnelResponse>(
			'GET',
			`${this.RESOURCE}/${id}?fields[clients]=tunnels`,
			undefined,
		);
		return response?.data;
	}

	async storedTunnels(id: string): Promise<StoredTunnel[]> {
		const response = await this.call<StoredTunnelResponse>(
			'GET',
			`${this.RESOURCE}/${id}/stored-tunnels?page[limit]=100`,
			undefined,
		);
		return response?.data;
	}

	async createTunnel(clientId: string, payload: TunnelPayload): Promise<{ data: Tunnel }> {
		return await this.call<{ data: Tunnel }>(
			'PUT',
			`${this.RESOURCE}/${clientId}/tunnels${toQueryString(payload)}`,
			undefined,
		);
	}

	async deleteTunnel(clientId: string, tunnelId: string) {
		return this.call(
			'DELETE',
			`${this.RESOURCE}/${clientId}/tunnels/${tunnelId}?force=true`,
			undefined,
		);
	}

	async updateTunnelAcl(clientId: string, tunnelId: string, acl: string) {
		return this.call(
			'PUT',
			`${this.RESOURCE}/${clientId}/tunnels/${tunnelId}/acl`,
			{ acl },
		);
	}

	async deleteStoredTunnel(clientId: string, tunnelId: string) {
		return this.call(
			'DELETE',
			`${this.RESOURCE}/${clientId}/stored-tunnels/${tunnelId}`,
			undefined,
		);
	}

	async updateStoredTunnel(clientId: string, tunnel: StoredTunnel) {
		return this.call(
			'PUT',
			`${this.RESOURCE}/${clientId}/stored-tunnels/${tunnel.id}`,
			{
				name: tunnel.name,
				scheme: tunnel.scheme,
				remote_ip: tunnel.remote_ip,
				remote_port: tunnel.remote_port,
				public_port: tunnel.public_port,
				acl: tunnel.acl,
				further_options: tunnel.further_options,
			},
		);
	}

	async updateTagsLabel(client: Client): Promise<never> {
		return await this.call(
			'PUT',
			`${this.RESOURCE}/${client.id}/attributes`,
			{
				tags: client.tags,
				labels: client.labels,
			},
		);
	}
}

export default ClientsModule;
