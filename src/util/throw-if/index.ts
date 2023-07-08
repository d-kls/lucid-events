export function throwIf(predicate: boolean, msg: string) {
	if (predicate) throw new Error(msg);
}
