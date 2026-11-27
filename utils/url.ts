export const resolvePublicApiUrl = (apiUrl?: string | null): string => {
	const configured = String(apiUrl || '').trim();
	if (!configured || configured === 'same-origin') {
		if (import.meta.client) return window.location.origin;
		return '';
	}
	return configured;
};

export const apiWebSocketUrl = (apiUrl: string, path: string, token: string | null | undefined): string => {
	const url = new URL(resolvePublicApiUrl(apiUrl));
	url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
	url.pathname = path;
	url.search = '';
	url.hash = '';
	if (token) {
		url.searchParams.set('access_token', token);
	}
	return url.toString();
};

export const getHostFromUrl = (fullUrl: string): string | null => {
	try {
		const url = new URL(fullUrl);
		return url.host;
	}
	catch (error) {
		console.error('Invalid URL provided:', fullUrl);
		console.log(error);
		return null;
	}
};
