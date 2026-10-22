function payloadMessage(payload: unknown): string {
	if (!payload) return '';
	if (typeof payload === 'string') return payload.trim();
	if (typeof payload !== 'object') return '';
	const record = payload as {
		errors?: Array<{ title?: string; detail?: string; code?: string }>;
		error?: string;
	};
	const item = Array.isArray(record.errors) ? record.errors[0] : undefined;
	if (item) {
		const title = String(item.title || '').trim();
		const detail = String(item.detail || '').trim();
		if (title && detail && detail !== title) return `${title} ${detail}`;
		return detail || title || String(item.code || '').trim();
	}
	return typeof record.error === 'string' ? record.error.trim() : '';
}

export function apiErrorMessage(error: unknown, fallback = 'Request failed.') {
	const err = error as {
		data?: unknown;
		response?: { _data?: unknown; data?: unknown };
		message?: string;
	} | null;
	const candidates = [err?.data, err?.response?._data, err?.response?.data, error];
	for (const candidate of candidates) {
		const message = payloadMessage(candidate);
		if (message) return message;
	}
	if (typeof err?.message === 'string' && err.message.trim()) return err.message.trim();
	return fallback;
}
