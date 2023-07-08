import { EyeOpenIcon } from "@radix-ui/react-icons";
import {
	ElementAccessor,
	ExtendedListenerWithIdentifier,
	ExtendedPublisher,
} from "../../event-system/event-bus";
import { useConsumeEvents } from "../../event-system/use-consume-events";
import { TAB_OVERVIEW_ID } from "../event-trace-tab-navigation";
import { TabContent } from "../tab-content";
import * as Accordion from "@radix-ui/react-accordion";
import { highlightElement } from "./util/highlight-element";
import { useState } from "react";
import { ChevronWithName } from "../chevron-with-name";

type OverviewTabProps = { filter: string };
type EventCardProps = {
	name: string;
	listeners: ExtendedListenerWithIdentifier[];
	publishers: ExtendedPublisher[];
};
type CountChipProps = {
	label: string;
	count: number;
	xl?: boolean;
};
type ListenerDisplayProps = { listeners: ExtendedListenerWithIdentifier[] };
type PublisherDisplayProps = { publishers: ExtendedPublisher[] };
type ListItemProps = { name: string; element?: ElementAccessor };

export const OverviewTab = ({ filter }: OverviewTabProps) => {
	const { listenerMap, publisherMap, events } = useConsumeEvents();
	const finalEvents = filter
		? events.filter((event) =>
				event.toLocaleLowerCase().includes(filter.toLowerCase()),
		  )
		: events;
	return (
		<TabContent value={TAB_OVERVIEW_ID}>
			<Accordion.Root
				type="multiple"
				className="et-flex et-flex-col et-gap-2.5 et-px-0.5"
			>
				{!finalEvents.length && (
					<div className="et-grid et-place-items-center et-pt-[38px] et-font-mono et-text-inactive-purple">
						No Events to display
					</div>
				)}
				{finalEvents.map((event) => (
					<EventCard
						key={event}
						name={event}
						listeners={listenerMap[event]}
						publishers={publisherMap[event]}
					/>
				))}
			</Accordion.Root>
		</TabContent>
	);
};

const EventCard = ({ name, listeners, publishers }: EventCardProps) => {
	return (
		<Accordion.Item
			value={name}
			className="et-z-10 et-cursor-pointer et-select-none et-rounded-md et-bg-card-purple focus-within:et-outline focus-within:et-outline-1 focus-within:et-outline-acc-purple"
		>
			<Accordion.Header>
				<Accordion.Trigger className="AccordionTrigger et-flex et-w-full et-items-center et-justify-between et-px-6 et-py-4 et-text-xl et-font-semibold et-text-label-purple et-outline-none">
					<ChevronWithName name={name} />
					<div className="ChipRow et-flex et-gap-10">
						<CountChip label="Subscribers" count={listeners.length} />
						<CountChip label="Publishers" count={publishers.length} />
					</div>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content className="AccordionContent et-px-14 et-pb-3">
				<div className="et-flex et-gap-8">
					<ListenerDisplay listeners={listeners} />
					<PublisherDisplay publishers={publishers} />
				</div>
			</Accordion.Content>
		</Accordion.Item>
	);
};

const CountChip = ({ label, count, xl }: CountChipProps) => {
	if (!count) return null;

	const color = label === "Subscribers" ? "et-bg-acc-blue" : "et-bg-acc-green";
	const xlCss = !!xl ? "et-text-lg et-font-semibold et-py-1" : "et-h-7";
	return (
		<div
			className={`et-grid et-w-52 et-place-items-center ${color} ${xlCss} et-select-none et-rounded et-text-sm et-text-label-black`}
		>
			{`#${label}: ${count}`}
		</div>
	);
};

const ListenerDisplay = ({ listeners }: ListenerDisplayProps) => {
	if (!listeners.length) return null;

	return (
		<div className="et-rounded et-bg-neutral-900">
			<CountChip label="Subscribers" count={listeners.length} xl />
			<ul className="et-list-none  et-p-3">
				{listeners.map((listener) => (
					<ListItem
						key={listener.id}
						name={listener.identifier}
						element={listener.element}
					/>
				))}
			</ul>
		</div>
	);
};

const PublisherDisplay = ({ publishers }: PublisherDisplayProps) => {
	if (!publishers.length) return null;

	return (
		<div className="et-rounded et-bg-neutral-900">
			<CountChip label="Publishers" count={publishers.length} xl />
			<ul className="et-list-none  et-p-3">
				{publishers.map((publisher) => (
					<ListItem
						key={publisher.id}
						name={publisher.identifier}
						element={publisher.element}
					/>
				))}
			</ul>
		</div>
	);
};

const ListItem = ({ name, element }: ListItemProps) => {
	const [disabled, setDisabled] = useState(false);

	const color = !disabled
		? "et-text-inactive-purple hover:et-text-acc-purple"
		: "et-text-label-purple et-opacity-40";

	const onClick = (element: ElementAccessor) => () => {
		setDisabled(true);
		highlightElement(element, setDisabled);
	};

	return (
		<li className="et-flex et-items-center et-gap-2 et-text-label-purple">
			<span>{name}</span>
			{!!element && (
				<EyeOpenIcon
					className={color}
					onClick={!disabled ? onClick(element) : undefined}
					aria-disabled={disabled}
				/>
			)}
		</li>
	);
};
