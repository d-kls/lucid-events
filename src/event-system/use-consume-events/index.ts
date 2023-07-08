import { useEffect } from "react";
import { useForceUpdate } from "../../hooks/use-force-update";
import { subscribe } from "../events-update-pipe";
import { EventBus } from "../event-bus";

export function useConsumeEvents() {
	const forceRerender = useForceUpdate();

	useEffect(() => {
		const unsub = subscribe(forceRerender);
		return unsub;
	}, []);

	return {
		listenerMap: EventBus.getEventListenerMap(),
		publisherMap: EventBus.getPublisherMap(),
		// returns event names in array shape for easier consumption
		events: Object.keys(EventBus.getEventListenerMap()),
	};
}
