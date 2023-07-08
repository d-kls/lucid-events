import { useEffect } from "react";
import { useForceUpdate } from "../../hooks/use-force-update";
import { subscribe } from "../flows-update-pipe";
import { EventTracer } from "../event-tracer";

export function useConsumeFlows() {
	const forceRerender = useForceUpdate();

	useEffect(() => {
		const unsub = subscribe(forceRerender);
		return unsub;
	}, []);

	return {
		traceMap: EventTracer.getTraceMap(),
		traces: Object.keys(EventTracer.getTraceMap()),
	};
}
