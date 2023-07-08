type VoidFn = () => void;
let flowConsumers: VoidFn[] = [];

export function subscribe(handler: VoidFn) {
	flowConsumers.push(handler);
	return () => {
		flowConsumers = flowConsumers.filter((consumer) => consumer !== handler);
	};
}

export function notify() {
	flowConsumers.forEach((consumer) => consumer());
}
