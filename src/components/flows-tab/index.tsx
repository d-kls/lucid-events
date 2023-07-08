import { MutableRefObject, forwardRef, useLayoutEffect, useRef, useState } from "react";
import { useConsumeFlows } from "../../event-system/use-consume-flows";
import { TAB_FLOWS_ID } from "../event-trace-tab-navigation";
import { TabContent } from "../tab-content";
import { GraphvizLoader, gv } from "./components/graphviz-loader";
import { Trace } from "../../event-system/event-tracer";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronWithName } from "../chevron-with-name";
import { createGraphDef } from "./util/create-graph-def";
import { ExportButton } from "../export-button";
import { saveSvg } from "./util/save-svg";

type FlowEntryProps = { name: string; trace: Trace };

export const FlowsTab = () => {
	const { traces, traceMap } = useConsumeFlows();
	const [isInitialized, setIsInitialized] = useState(false);
	return (
		<TabContent value={TAB_FLOWS_ID}>
			{!isInitialized && <GraphvizLoader setIsInitialized={setIsInitialized} />}
			{isInitialized && !traces.length && (
				<div className="et-grid et-place-items-center et-pt-[38px] et-font-mono et-text-inactive-purple">
					No Flows to display
				</div>
			)}
			{isInitialized && (
				<Accordion.Root
					type="multiple"
					className="et-flex et-flex-col et-gap-2.5 et-px-0.5"
				>
					{traces.map((trace) => (
						<FlowEntry key={trace} name={trace} trace={traceMap[trace]} />
					))}
				</Accordion.Root>
			)}
		</TabContent>
	);
};

const FlowEntry = ({ name, trace }: FlowEntryProps) => {
	const ref = useRef<HTMLDivElement | null>(null);
	return (
		<Accordion.Item
			value={name}
			className="et-z-10 et-cursor-pointer et-select-none et-rounded-md et-bg-card-purple focus-within:et-outline focus-within:et-outline-1 focus-within:et-outline-acc-purple"
		>
			<Accordion.Header>
				<Accordion.Trigger className="AccordionTrigger et-flex et-w-full et-items-center et-justify-between et-px-6 et-py-4 et-text-xl et-font-semibold et-text-label-purple et-outline-none">
					<ChevronWithName name={name} />
					<ExportButton
						className="ExportButton"
						onClick={() => saveSvg(ref, name)}
					/>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content className="AccordionContent et-px-14 et-pb-3">
				<div className="et-flex et-gap-8">
					<TraceDisplay ref={ref} name={name} trace={trace} />;
				</div>
			</Accordion.Content>
		</Accordion.Item>
	);
};

const TraceDisplay = forwardRef<HTMLDivElement | null, FlowEntryProps>(
	({ name, trace }, ref) => {
		useLayoutEffect(() => {
			const refObj = ref as MutableRefObject<HTMLDivElement | null>;
			if (!refObj.current) return;

			const graph = createGraphDef(name, trace);
			const svg = gv?.layout(graph, "svg", "dot");
			if (svg) refObj.current.innerHTML = svg;
		}, [trace]);

		return <div ref={ref} />;
	},
);
