import { HttpFactory } from '~/repository/factory';
import type { AuditLogResponse } from '~/types';

class AuditModule extends HttpFactory {
	async list(offset = 0, limit = 100): Promise<AuditLogResponse> {
		return this.call(
			'GET',
			`/api/v1/auditlog?sort=-timestamp&page[limit]=${limit}&page[offset]=${offset}`,
			undefined,
		);
	}
}

export default AuditModule;
