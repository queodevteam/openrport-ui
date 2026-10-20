export const apiWebSocketUrl = (apiUrl: string, path: string, token: string | null | undefined): string => {
	const url = new URL(apiUrl);
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
