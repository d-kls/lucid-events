import { useEffect } from "react";
import { useForceUpdate } from "../../hooks/use-force-update";
import { subscribe } from "../logs-update-pipe";
import { EventLogger } from "../event-logger";

export function useConsumeLogs() {
	const forceRerender = useForceUpdate();

	useEffect(() => {
		const unsub = subscribe(forceRerender);
		return unsub;
	}, []);

	return {
		logs: EventLogger.getLogs(),
		clear: EventLogger.clearLogs,
	};
}
