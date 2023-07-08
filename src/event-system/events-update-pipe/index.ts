type VoidFn = () => void;
let updateConsumers: VoidFn[] = [];

export function subscribe(handler: VoidFn) {
	updateConsumers.push(handler);
	return () => {
		updateConsumers = updateConsumers.filter((consumer) => consumer !== handler);
	};
}

export function notify() {
	updateConsumers.forEach((consumer) => consumer());
}
