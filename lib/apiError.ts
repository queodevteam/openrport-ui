export function apiErrorMessage(error: unknown, fallback = 'Request failed.') {
	const data = (error as { data?: { errors?: { title?: string; detail?: string }[]; error?: string } })?.data;
	const item = data?.errors?.[0];
	return item?.detail || item?.title || data?.error || fallback;
}
