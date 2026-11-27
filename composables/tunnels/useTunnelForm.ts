import { storeToRefs } from 'pinia';
import type { TunnelFormState, TunnelPayload } from '~/types';
import { useTunnelValidation } from '~/composables/tunnels/useTunnelValidation';
import { TUNNEL_OPTIONS } from '~/constants';
import { duplicateTunnelMessage, tunnelErrorMessage } from '~/composables/tunnels/storedTunnel';

export function useTunnelForm(client: any) {
	const tunnelStore = useTunnelStore();
	const { $api } = useNuxtApp();
	const snackbar = useSnackbar();
	const profileStore = useProfile();
	const { ip: serverIp } = storeToRefs(profileStore);
	const errors = ref<unknown>(null);

	const formState = reactive<TunnelFormState>({
		service: 'ssh',
		forwardingService: 'ssh',
		forwardDestination: '192.250.198.203',
		port: 22,
		storeInLibrary: false,
		protocol: 'tcp',
		name: '',
		lport_random: 'random',
		lport: 20000,
		acl_model: 'current',
		acl_risk: false,
		acl: '',
		http_proxy: false,
		auth_user: '',
		auth_password: '',
		host_header: '',
		skip_idle_timeout: true,
		idle_timeout_minutes: 5,
		autoclose_enable: false,
		autoclose_hour: 2,
		autoclose_minute: 30,
	});

	const isLoading = ref(false);

	const { lportError, lportErrorMessage, forwardingError, isFormValid } = useTunnelValidation(formState);

	const handleServiceChange = (newService: string) => {
		const config = TUNNEL_OPTIONS.find(config => config.id === newService);
		if (config?.ports) {
			formState.port = parseInt(config.ports);
		}
	};

	const applyCurrentIp = async () => {
		await profileStore.loadServerIp();
		if (formState.acl_model === 'current') {
			formState.acl = serverIp.value;
		}
	};

	const handleAclModelChange = (acl: string) => {
		switch (acl) {
			case 'current':
				formState.acl = serverIp.value;
				applyCurrentIp();
				break;
			case 'specific':
				formState.acl = `${serverIp.value}/24`;
				break;
			case 'anyone':
				formState.acl = '0.0.0.0/0';
				break;
			default:
				break;
		}
	};

	const submitError = computed(() => errors.value ? tunnelErrorMessage(errors.value) : '');
	const portApiError = computed(() => {
		if (!submitError.value || /already exist/i.test(submitError.value)) return '';
		return /port/i.test(submitError.value) ? submitError.value : '';
	});
	const aclApiError = computed(() => /acl/i.test(submitError.value) ? submitError.value : '');
	const formApiError = computed(() => submitError.value);

	const blockedReason = () => {
		if (formState.acl_model === 'anyone' && !formState.acl_risk) {
			return 'Confirm that you accept the risk of an open ACL.';
		}
		if (formState.storeInLibrary && !formState.name) {
			return 'A name is required to store this tunnel.';
		}
		if (formState.lport_random === 'specify' && lportError.value) {
			return lportErrorMessage.value || 'The public port is not valid.';
		}
		return '';
	};

	const fail = (error: unknown) => {
		errors.value = error;
		snackbar.add({
			type: 'error',
			text: tunnelErrorMessage(error),
		});
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		errors.value = null;
		if (!isFormValid.value) {
			fail({ errors: [{ title: blockedReason() || 'Check the tunnel form and try again.' }] });
			return;
		}
		const payload: TunnelPayload = {
			remote: String(formState.port),
			scheme: formState.service,
			acl: formState.acl,
			protocol: formState.protocol,
		};
		if (formState.lport_random === 'specify' && formState.lport) {
			payload.local = String(formState.lport);
		}
		if (formState.name) {
			payload.name = formState.name;
		}

		if (formState.service === 'forwarding' && formState.forwardingService) {
			payload.scheme = formState.forwardingService;
			payload.remote = `${formState.forwardDestination}:${formState.port}`;
		}
		if (formState.skip_idle_timeout) {
			payload['idle-timeout-minutes'] = formState.idle_timeout_minutes;
		}
		else {
			payload['skip-idle-timeout'] = 1;
		}

		if (formState.autoclose_enable) {
			payload['auto-close'] = `${formState.autoclose_hour}h${formState.autoclose_minute}m`;
		}
		if (formState.http_proxy) {
			payload.http_proxy = formState.http_proxy;
		}
		const duplicate = duplicateTunnelMessage(client.id, payload);
		if (duplicate) {
			fail({ errors: [{ title: duplicate }] });
			return;
		}

		try {
			isLoading.value = true;
			if (formState.storeInLibrary) {
				const forwarding = formState.service === 'forwarding';
				const further: Record<string, unknown> = {
					protocol: formState.protocol,
				};
				if (forwarding) further.is_service_forwarding = true;
				if (formState.skip_idle_timeout) further['idle-timeout-minutes'] = formState.idle_timeout_minutes;
				else further['skip-idle-timeout'] = 1;
				if (formState.autoclose_enable) {
					further['auto-close'] = `${formState.autoclose_hour}h${formState.autoclose_minute}m`;
				}
				if (formState.http_proxy) {
					further.http_proxy = true;
					if (formState.host_header) further.host_header = formState.host_header;
					if (formState.auth_user) further.auth_user = formState.auth_user;
					if (formState.auth_password) further.auth_password = formState.auth_password;
				}
				await $api.clients.createStoredTunnel(client.id, {
					name: formState.name,
					scheme: payload.scheme,
					remote_ip: forwarding ? formState.forwardDestination : '127.0.0.1',
					remote_port: Number(formState.port),
					public_port: formState.lport_random === 'specify' ? Number(formState.lport) : 0,
					acl: formState.acl,
					further_options: further,
				});
				await refreshNuxtData(`stored_tunnels_${client.id}`);
			}
			const { data, error } = await tunnelStore.createTunnel(client.id, payload);
			if (error || !data) {
				fail(error ?? { errors: [{ title: 'Could not start the tunnel.' }] });
				return;
			}
			await refreshNuxtData(`tunnels_${client.id}`);
			tunnelStore.closeAddTunnel();
			snackbar.add({
				type: 'success',
				text: 'Tunnel created',
			});
		}
		catch (e) {
			fail(e);
		}
		finally {
			isLoading.value = false;
		}
	};

	watch(() => formState.service, handleServiceChange);
	watch(() => formState.acl_model, handleAclModelChange);

	onMounted(async () => {
		await applyCurrentIp();
	});
	return {
		formState,
		isLoading,
		lportError,
		lportErrorMessage,
		forwardingError,
		portApiError,
		aclApiError,
		formApiError,
		isFormValid,
		handleSubmit,
	};
}
