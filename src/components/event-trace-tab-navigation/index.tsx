import { Dispatch, SetStateAction, useRef, useState } from "react";
import { TabItem, TabNavigation } from "../tab-navigation";
import * as Popover from "@radix-ui/react-popover";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { OverviewTab } from "../overview-tab";
import { LogTab } from "../log-tab";
import { FlowsTab } from "../flows-tab";
import { HStack } from "../h-stack";

// type EventTraceTabNavigationProps = {
// 	expanded: boolean;
// 	setExpanded: (val: boolean) => void;
// };
type SearchFieldProps = { setFilter: Dispatch<SetStateAction<string>> };
type FilterAndCloseRowProps = SearchFieldProps & { selected: string };

export const TAB_OVERVIEW_ID = "overview";
export const TAB_LOG_ID = "log";
export const TAB_FLOWS_ID = "flows";

const ITEMS: TabItem[] = [
	{
		id: TAB_OVERVIEW_ID,
		label: "Overview",
	},
	{
		id: TAB_LOG_ID,
		label: "Log",
	},
	{
		id: TAB_FLOWS_ID,
		label: "Flows",
	},
];

export const EventTraceTabNavigation = () => {
	const [filter, setFilter] = useState("");
	const [tabId, setTabId] = useState(TAB_OVERVIEW_ID);
	return (
		<TabNavigation
			className="et-flex et-h-full et-flex-col et-overflow-hidden"
			label="Explore your event system"
			items={ITEMS}
			value={tabId}
			defaultTab={TAB_OVERVIEW_ID}
			onChange={setTabId}
			tabsRightNode={<FilterAndCloseRow selected={tabId} setFilter={setFilter} />}
		>
			<OverviewTab filter={filter} />
			<LogTab />
			<FlowsTab />
		</TabNavigation>
	);
};

const FilterAndCloseRow = ({ selected, setFilter }: FilterAndCloseRowProps) => {
	// const Icon = expanded ? DoubleArrowDownIcon : DoubleArrowUpIcon;
	return (
		<HStack className="et-items-center et-gap-10">
			{selected === TAB_OVERVIEW_ID && <SearchField setFilter={setFilter} />}
			<HStack className="et-items-center et-gap-5">
				{/* <Icon
					className="et-h-5 et-w-5 et-text-acc-purple"
					onClick={() => setExpanded(!expanded)}
				/> */}
				<Popover.Close className="et-grid et-h-6 et-w-6 et-cursor-pointer et-place-items-center et-rounded-md focus-visible:et-border focus-visible:et-border-solid focus-visible:et-border-acc-purple focus-visible:et-outline-none">
					<Cross1Icon className="et-h-5 et-w-5 et-text-acc-purple" />
				</Popover.Close>
			</HStack>
		</HStack>
	);
};

const SearchField = ({ setFilter }: SearchFieldProps) => {
	const [value, setValue] = useState("");
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		setValue(e.target.value);
		// keep rerenders inside search field until user stopped typing, then update state above
		debounceRef.current = setTimeout(() => {
			setFilter(e.target.value);
		}, 300);
	};

	return (
		<div className="et-relative">
			<div className="et-absolute et-bottom-0 et-left-0 et-top-0 et-flex et-w-9 et-select-none et-items-center et-justify-center">
				<MagnifyingGlassIcon className="et-h-5 et-w-5 et-text-neutral-500" />
			</div>
			<input
				className="et-block et-h-9 et-appearance-none et-rounded et-border-[0.0625rem] et-border-solid et-border-neutral-700 et-bg-card-purple et-pb-[9px] et-pl-9 et-pr-3 et-pt-2 et-text-left et-align-middle et-font-sans et-text-sm et-leading-[2.125rem] et-text-label-purple et-outline-none et-transition-[border-color] et-duration-200 focus:et-border-acc-purple"
				value={value}
				onChange={onChange}
				type="search"
				placeholder="Search..."
			/>
		</div>
	);
};
