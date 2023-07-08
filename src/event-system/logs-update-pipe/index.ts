type VoidFn = () => void;
let logsConsumers: VoidFn[] = [];

export function subscribe(handler: VoidFn) {
	logsConsumers.push(handler);
	return () => {
		logsConsumers = logsConsumers.filter((consumer) => consumer !== handler);
	};
}

export function notify() {
	logsConsumers.forEach((consumer) => consumer());
}
