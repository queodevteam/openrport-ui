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
		if (external.apiUrl) config.public.apiUrl = external.apiUrl;
		if (typeof external.monitoringEnabled === 'boolean') {
			config.public.monitoringEnabled = external.monitoringEnabled;
		}
		if (external.appEnv) config.public.appEnv = external.appEnv;
	},
});
