import { HttpFactory, HttpMethod } from '~/repository/factory';
import type { Client, ClientGroup, ClientGroupResponse } from '~/types';

class GroupsModule extends HttpFactory {
	private RESOURCE = '/api/v1/client-groups';

	async listGroups(): Promise<ClientGroupResponse> {
		const pageSize = 500;
		const fields = 'id,description,num_clients,num_clients_connected';
		const all: ClientGroup[] = [];
		let offset = 0;
		let total = 0;

		do {
			const page = await this.call<ClientGroupResponse>(
				'GET',
				`${this.RESOURCE}?page[limit]=${pageSize}&page[offset]=${offset}&fields[client_groups]=${fields}`,
				undefined,
			);
			const batch = page.data ?? [];
			total = page.meta?.count ?? all.length + batch.length;
			all.push(...batch);
			if (!batch.length) break;
			offset += batch.length;
		} while (offset < total);

		return { data: all, meta: { count: total } };
	}

	async listAll(): Promise<ClientGroupResponse> {
		const pageSize = 500;
		const fields = 'id,description,allowed_user_groups,num_clients';
		const all: ClientGroup[] = [];
		let offset = 0;
		let total = 0;

		do {
			const page = await this.call<ClientGroupResponse>(
				'GET',
				`${this.RESOURCE}?page[limit]=${pageSize}&page[offset]=${offset}&fields[client_groups]=${fields}`,
				undefined,
			);
			const batch = page.data ?? [];
			total = page.meta?.count ?? all.length + batch.length;
			all.push(...batch);
			if (!batch.length) break;
			offset += batch.length;
		} while (offset < total);

		return { data: all, meta: { count: total } };
	}

	async paginate(page = 0, itemPerPage = 20): Promise<ClientGroupResponse> {
		const offset = page * itemPerPage;
		return this.call<ClientGroupResponse>(
			'GET',
			`${this.RESOURCE}?page[limit]=${itemPerPage}&page[offset]=${offset}&fields[client_groups]=id,description,params,allowed_user_groups`, undefined);
	}

	async create(payload: Client): Promise<any> {
		return this.call(
			HttpMethod.POST,
			`${this.RESOURCE}`,
			payload,
		);
	}

	async show(group_id: string): Promise<{ data: ClientGroup }> {
		return this.call(
			'GET',
			`${this.RESOURCE}/${encodeURIComponent(group_id)}`,
			undefined,
		);
	}

	async update(group_id: string, payload: Partial<ClientGroup>): Promise<any> {
		return this.call(
			'PUT',
			`${this.RESOURCE}/${encodeURIComponent(group_id)}`,
			payload,
		);
	}

	async delete(group_id: string): Promise<any> {
		return this.call(
			'DELETE',
			`${this.RESOURCE}/${encodeURIComponent(group_id)}`,
			undefined,
		);
	}
}

export default GroupsModule;
