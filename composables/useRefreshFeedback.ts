import { apiErrorMessage } from '~/lib/apiError';

export function useRefreshFeedback() {
	const snackbar = useSnackbar();
	const refreshing = ref(false);
	const note = ref('');

	const run = async (label: string, action: () => Promise<unknown>) => {
		if (refreshing.value) return;
		refreshing.value = true;
		try {
			await action();
			const time = new Intl.DateTimeFormat('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hourCycle: 'h23',
			}).format(new Date());
			note.value = `${label} refreshed at ${time}`;
			snackbar.add({
				type: 'success',
				text: note.value,
			});
		}
		catch (error) {
			snackbar.add({
				type: 'error',
				text: apiErrorMessage(error, `Could not refresh ${label.toLowerCase()}.`),
			});
		}
		finally {
			refreshing.value = false;
		}
	};

	return { refreshing, note, run };
}
