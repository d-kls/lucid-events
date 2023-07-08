import { Log } from "../../../../event-system/event-logger";
import { convertToLocaleTime } from "../../../../util/convert-to-locale-time";

export function exportLogs(logs: Log[]) {
	const textContent = transformLogsToText(logs);
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		`data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`,
	);
	element.setAttribute("download", "logs.txt");

	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function transformLogsToText(logs: Log[]) {
	return logs
		.map(
			(log) =>
				`[${convertToLocaleTime(log.timestamp)}]: ${log.sender} ---- ${
					log.event
				} ----> ${log.receivers
					.map((receiver) => receiver.identifier)
					.join(",")}`,
		)
		.join("\n");
}
