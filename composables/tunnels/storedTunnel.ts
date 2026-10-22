import type { StoredTunnel, Tunnel, TunnelPayload } from '~/types';
import { apiErrorMessage } from '~/lib/apiError';

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
	return apiErrorMessage(error, 'Could not start the tunnel.');
}

export function isSshTunnel(tunnel: { scheme?: string }) {
	return String(tunnel?.scheme || '').toLowerCase() === 'ssh';
}

export function tunnelSshCommand(tunnel: { lport?: string | number; lhost?: string }, apiUrl: string, user: string) {
	const port = String(tunnel.lport ?? '').trim();
	const login = String(user || '').trim();
	if (!port || !login) return '';
	let host = window.location.hostname;
	try {
		host = new URL(apiUrl).hostname || host;
	}
	catch {
		host = window.location.hostname;
	}
	const bind = String(tunnel.lhost || '').trim();
	if (bind && !['0.0.0.0', '::', '127.0.0.1', 'localhost', '*'].includes(bind)) {
		host = bind;
	}
	return `ssh -p ${port} ${login}@${host}`;
}

function aclKey(value: string) {
	return String(value || '').split(',').map(part => part.trim()).filter(Boolean).sort().join(',');
}

function remoteParts(remote: string) {
	const value = String(remote || '');
	const index = value.lastIndexOf(':');
	if (index === -1) return { host: '127.0.0.1', port: value };
	return { host: value.slice(0, index) || '127.0.0.1', port: value.slice(index + 1) };
}

function cachedTunnels(clientId: string): Tunnel[] {
	const cached = useNuxtData(`tunnels_${clientId}`).data.value as { tunnels?: Tunnel[]; data?: { tunnels?: Tunnel[] } } | Tunnel[] | null;
	if (!cached) return [];
	if (Array.isArray(cached)) return cached;
	if (Array.isArray(cached.tunnels)) return cached.tunnels;
	if (Array.isArray(cached.data?.tunnels)) return cached.data.tunnels;
	return [];
}

export function duplicateTunnelMessage(clientId: string, payload: TunnelPayload) {
	const { host, port } = remoteParts(String(payload.remote || ''));
	const scheme = String(payload.scheme || '').toLowerCase();
	const protocol = String(payload.protocol || 'tcp').toLowerCase();
	const acl = aclKey(payload.acl || '');
	const match = cachedTunnels(clientId).find((tunnel) => {
		const tunnelHost = String(tunnel.rhost || '127.0.0.1');
		const sameHost = host === '127.0.0.1' || host === '0.0.0.0' || host === tunnelHost;
		return String(tunnel.rport) === port
			&& String(tunnel.scheme || '').toLowerCase() === scheme
			&& String(tunnel.protocol || 'tcp').toLowerCase() === protocol
			&& aclKey(tunnel.acl || '') === acl
			&& sameHost;
	});
	if (!match) return '';
	return `A tunnel to port ${port} already exists for this ACL.`;
}
