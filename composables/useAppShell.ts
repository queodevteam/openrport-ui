const mobileNavOpen = ref(false);

export function useAppShell() {
	const openMobileNav = () => {
		mobileNavOpen.value = true;
	};
	const closeMobileNav = () => {
		mobileNavOpen.value = false;
	};

	return {
		mobileNavOpen,
		openMobileNav,
		closeMobileNav,
	};
}
