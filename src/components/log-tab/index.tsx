import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Log } from "../../event-system/event-logger";
import { useConsumeLogs } from "../../event-system/use-consume-logs";
import { convertToLocaleTime } from "../../util/convert-to-locale-time";
import { TAB_LOG_ID } from "../event-trace-tab-navigation";
import { HStack } from "../h-stack";
import { TabContent } from "../tab-content";
import { VStack } from "../v-stack";
import { exportLogs } from "./util/export-logs";
import { ExportButton } from "../export-button";

export const LogTab = () => {
	const { logs, clear } = useConsumeLogs();
	return (
		<TabContent value={TAB_LOG_ID} noPt>
			<HStack className="et-justify-end et-gap-2.5">
				<ExportButton onClick={() => exportLogs(logs)} />
				<ClearButton onClick={clear} />
			</HStack>
			<VStack className="et-gap-2.5 et-px-0.5">
				{!logs.length && (
					<div className="et-grid et-place-items-center et-font-mono et-text-inactive-purple">
						No Logs to display
					</div>
				)}
				{logs.map((log, idx) => (
					<LogEntry key={`${log.timestamp}-${idx}`} log={log} />
				))}
			</VStack>
		</TabContent>
	);
};

const ClearButton = ({ onClick }: { onClick: () => void }) => (
	<button
		className="et-mb-2.5 et-h-7 et-w-32 et-rounded et-bg-acc-purple et-font-sans et-font-medium et-text-dark-purple hover:et-bg-purple-600"
		onClick={onClick}
	>
		Clear
	</button>
);

const LogEntry = ({ log }: { log: Log }) => {
	const time = convertToLocaleTime(log.timestamp);
	return (
		<ScrollArea.Root className="ScrollAreaRoot et-h-[60px] et-w-full et-overflow-hidden et-rounded-md et-bg-card-purple et-px-6">
			<ScrollArea.Viewport className="et-h-full">
				<HStack className="et-h-[60px] et-w-full et-select-none et-items-center et-gap-4 et-rounded-md  et-text-xl focus-within:et-outline focus-within:et-outline-1 ">
					<div className="et-w-24 et-font-semibold et-text-neutral-400">{`[${time}]: `}</div>
					<div className="et-flex-shrink-0 et-font-semibold et-text-acc-green">
						{log.sender}
					</div>
					<LogArrow event={log.event} />
					<div className="et-flex-shrink-0 et-font-semibold et-text-acc-blue">
						{log.receivers.map((receiver) => receiver.identifier).join(", ")}
					</div>
				</HStack>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="ScrollAreaScrollbar et-cursor-pointer et-bg-card-purple"
				orientation="horizontal"
			>
				<ScrollArea.Thumb className="ScrollAreaThumb et-bg-acc-purple" />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	);
};

const LogArrow = ({ event }: { event: string }) => {
	return (
		<>
			<div className="et-flex-shrink-0 et-text-neutral-400">{"-----"}</div>
			<div className="et-flex-shrink-0 et-font-semibold et-text-label-purple">
				{event}
			</div>
			<div className="et-flex-shrink-0 et-text-neutral-400">{"----->"}</div>
		</>
	);
};
