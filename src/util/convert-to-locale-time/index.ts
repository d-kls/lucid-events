export function convertToLocaleTime(timestamp: number) {
	const userTime = Intl.DateTimeFormat().resolvedOptions();
	const date = new Date(timestamp);

	return date.toLocaleTimeString(userTime.locale);
}
