import { HttpFactory } from '~/repository/factory';
import type { UserGroup, UserGroupResponse } from '~/types';

class UserGroupsModule extends HttpFactory {
	private RESOURCE = 'api/v1/user-groups';

	async all(): Promise<UserGroup[]> {
		const response = await this.call<UserGroupResponse>(
			'GET',
			`${this.RESOURCE}`,
			undefined,
		);
		return response.data;
	}

	async update(name: string, group: UserGroup): Promise<UserGroup> {
		const response = await this.call<{ data: UserGroup }>(
			'PUT',
			`${this.RESOURCE}/${encodeURIComponent(name)}`,
			group,
		);
		return response.data;
	}
}

export default UserGroupsModule;
