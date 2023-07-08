import { ExtendedListenerWithIdentifier } from "../event-bus";
import { notify } from "../logs-update-pipe";

export type Log = {
	event: string;
	sender: string;
	receivers: ExtendedListenerWithIdentifier[];
	timestamp: number;
};

export class EventLogger {
	private static logs: Log[] = [];

	static getLogs() {
		return EventLogger.logs;
	}

	static addLog(
		event: string,
		sender: string,
		receivers: ExtendedListenerWithIdentifier[],
	) {
		EventLogger.logs.push({ event, sender, receivers, timestamp: Date.now() });
		notify();
	}

	static clearLogs() {
		EventLogger.logs = [];
		notify();
	}
}
