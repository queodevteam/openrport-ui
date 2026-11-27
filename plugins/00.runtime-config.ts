type PublicRuntime = {
	apiUrl?: string;
	monitoringEnabled?: boolean;
	appEnv?: string;
};

declare global {
	interface Window {
		__RPORT_CONFIG__?: PublicRuntime;
	}
}

export default defineNuxtPlugin({
	name: 'runtime-public-config',
	enforce: 'pre',
	setup() {
		const external = window.__RPORT_CONFIG__;
		if (!external) return;
		const config = useRuntimeConfig();
		const publicConfig = config.public as PublicRuntime & Record<string, unknown>;
		// Prefer Object.assign: some Nuxt builds expose a readonly proxy for public config.
		Object.assign(publicConfig, {
			...(typeof external.apiUrl === 'string' ? { apiUrl: external.apiUrl } : {}),
			...(typeof external.monitoringEnabled === 'boolean'
				? { monitoringEnabled: external.monitoringEnabled }
				: {}),
			...(external.appEnv ? { appEnv: external.appEnv } : {}),
		});
	},
});
