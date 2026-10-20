import type { StoredTunnel, TunnelPayload } from '~/types';

function tunnelOptions(value: unknown): Record<string, unknown> {
	if (!value) return {};
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return parsed && typeof parsed === 'object' ? parsed : {};
		}
		catch {
			return {};
		}
	}
	return typeof value === 'object' ? value as Record<string, unknown> : {};
}

export function payloadFromStoredTunnel(tunnel: StoredTunnel): TunnelPayload {
	const options = tunnelOptions(tunnel.further_options);
	const remoteHost = tunnel.remote_ip || '127.0.0.1';
	const protocol = options.protocol === 'udp' || options.protocol === 'tcp+udp' || options.protocol === 'tcp'
		? options.protocol
		: 'tcp';
	const payload: TunnelPayload = {
		remote: `${remoteHost}:${tunnel.remote_port}`,
		scheme: tunnel.scheme || '',
		acl: tunnel.acl || '',
		protocol,
	};

	const publicPort = Number(tunnel.public_port);
	if (publicPort > 0) {
		payload.local = String(publicPort);
	}
	if (tunnel.name) {
		payload.name = tunnel.name;
	}

	const skipIdle = options['skip-idle-timeout'] === true || options['skip-idle-timeout'] === 1 || options['skip-idle-timeout'] === '1';
	if (skipIdle) {
		payload['skip-idle-timeout'] = 1;
	}
	else if (options['idle-timeout-minutes'] !== undefined && options['idle-timeout-minutes'] !== null && options['idle-timeout-minutes'] !== '') {
		payload['idle-timeout-minutes'] = Number(options['idle-timeout-minutes']);
	}

	if (options['auto-close']) {
		payload['auto-close'] = String(options['auto-close']);
	}
	if (options.http_proxy === true || options.http_proxy === 'true') {
		payload.http_proxy = true;
	}
	if (options.host_header) {
		payload.host_header = String(options.host_header);
	}
	if (options.auth_user) {
		payload.auth_user = String(options.auth_user);
	}
	if (options.auth_password) {
		payload.auth_password = String(options.auth_password);
	}

	return payload;
}

export function tunnelPageUrl(tunnel: { tunnel_url?: string; scheme?: string; lport?: string | number }, apiUrl: string) {
	const given = String(tunnel.tunnel_url || '').trim();
	if (given) return given;
	const port = String(tunnel.lport ?? '').trim();
	if (!port) return '';
	let host = window.location.hostname;
	try {
		host = new URL(apiUrl).hostname || host;
	}
	catch {
		host = window.location.hostname;
	}
	const scheme = String(tunnel.scheme || '').toLowerCase();
	const proto = scheme === 'https' ? 'https' : 'http';
	return `${proto}://${host}:${port}`;
}

export function openActiveTunnel(tunnel: { tunnel_url?: string; scheme?: string; lport?: string | number }, apiUrl: string) {
	const url = tunnelPageUrl(tunnel, apiUrl);
	if (!url) return;
	window.open(url, '_blank', 'noopener,noreferrer');
}

export function tunnelErrorMessage(error: unknown) {
	const payload = error as { errors?: Array<{ title?: string; detail?: string }> };
	const item = payload?.errors?.[0];
	if (item?.title && item.detail) return `${item.title} ${item.detail}`;
	if (item?.title) return item.title;
	return 'Could not start the tunnel.';
}
