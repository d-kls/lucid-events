export function resolveBgColor(
	node: string,
	senders: Set<string>,
	receivers: Set<string>,
) {
	if (senders.has(node) && receivers.has(node)) return "#A64CFF";

	if (senders.has(node)) return "#90C418";

	return "#59ADFF";
}

export function resolveTitle(node: string, senders: Set<string>, receivers: Set<string>) {
	if (senders.has(node) && receivers.has(node)) return "Both";

	if (senders.has(node)) return "Publisher";

	return "Subscriber";
}
