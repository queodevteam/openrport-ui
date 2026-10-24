export type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'color-mode';

let systemListenerAttached = false;

function prefersDark() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredMode(): ColorMode | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		if (value === 'light' || value === 'dark') return value;
	}
	catch {
		// localStorage can be unavailable in private contexts.
	}
	return null;
}

function applyColorMode(mode: ColorMode) {
	document.documentElement.classList.toggle('dark', mode === 'dark');
	document.documentElement.style.colorScheme = mode;
}

export function useColorMode() {
	const mode = useState<ColorMode>('color-mode', () => {
		if (!import.meta.client) return 'light';
		const initial = readStoredMode() ?? (prefersDark() ? 'dark' : 'light');
		applyColorMode(initial);
		return initial;
	});
	const isDark = computed(() => mode.value === 'dark');

	const setMode = (next: ColorMode) => {
		mode.value = next;
		try {
			localStorage.setItem(STORAGE_KEY, next);
		}
		catch {
			// Ignore storage failures and still apply the chosen mode.
		}
		applyColorMode(next);
	};

	const toggle = () => {
		setMode(isDark.value ? 'light' : 'dark');
	};

	const init = () => {
		const stored = readStoredMode();
		if (stored) {
			mode.value = stored;
			applyColorMode(stored);
			return;
		}

		const syncSystem = () => {
			if (readStoredMode()) return;
			const next: ColorMode = prefersDark() ? 'dark' : 'light';
			mode.value = next;
			applyColorMode(next);
		};

		syncSystem();

		if (!systemListenerAttached) {
			systemListenerAttached = true;
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncSystem);
		}
	};

	return {
		mode,
		isDark,
		setMode,
		toggle,
		init,
	};
}
