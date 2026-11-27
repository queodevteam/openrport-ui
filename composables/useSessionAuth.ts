/** Cookie/localStorage keys dedicated to this UI (avoid clashing with legacy Secure cookies on the same host). */
export const SESSION_TOKEN_KEY = 'openrport_ui_token';
export const SESSION_AUTH_KEY = 'openrport_ui_auth';

function sessionMaxAge(lifetimeSeconds: string): number | undefined {
	const seconds = Number(lifetimeSeconds);
	if (Number.isFinite(seconds) && seconds > 0) {
		return Math.floor(seconds);
	}
	return undefined;
}

export function sessionCookieOptions(lifetimeSeconds?: string) {
	const options: { path: string; sameSite: 'lax'; secure?: boolean; maxAge?: number } = {
		path: '/',
		sameSite: 'lax',
	};
	if (import.meta.client && window.location.protocol === 'https:') {
		options.secure = true;
	}
	if (lifetimeSeconds) {
		const maxAge = sessionMaxAge(lifetimeSeconds);
		if (maxAge) options.maxAge = maxAge;
	}
	return options;
}

export function readSessionToken(): string | null {
	if (import.meta.client) {
		try {
			const fromLs = localStorage.getItem(SESSION_TOKEN_KEY);
			if (fromLs) return fromLs;
		}
		catch {
			// private mode / blocked storage
		}
	}
	const token = useCookie<string | null>(SESSION_TOKEN_KEY);
	return token.value ?? null;
}

export function writeSessionToken(accessToken: string, lifetimeSeconds: string) {
	const options = sessionCookieOptions(lifetimeSeconds);
	const token = useCookie<string | null>(SESSION_TOKEN_KEY, options);
	const flagged = useCookie<boolean | null>(SESSION_AUTH_KEY, options);
	token.value = accessToken;
	flagged.value = true;
	if (import.meta.client) {
		try {
			localStorage.setItem(SESSION_TOKEN_KEY, accessToken);
			localStorage.setItem(SESSION_AUTH_KEY, '1');
		}
		catch {
			// ignore
		}
	}
}

export function clearSessionToken() {
	const token = useCookie<string | null>(SESSION_TOKEN_KEY);
	const flagged = useCookie<boolean | null>(SESSION_AUTH_KEY);
	token.value = null;
	flagged.value = false;
	if (import.meta.client) {
		try {
			localStorage.removeItem(SESSION_TOKEN_KEY);
			localStorage.removeItem(SESSION_AUTH_KEY);
		}
		catch {
			// ignore
		}
	}
}

export function hasSessionToken(): boolean {
	return Boolean(readSessionToken());
}
