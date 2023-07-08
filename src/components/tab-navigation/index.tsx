import * as Tabs from "@radix-ui/react-tabs";
import { PropsWithChildren, ReactNode } from "react";
import { HStack } from "../h-stack";

export type TabItem = { id: string; label: string };
type TabNavigationProps = PropsWithChildren<{
	className?: string;
	label: string;
	items: TabItem[];
	value: string;
	defaultTab?: string;
	onChange: (val: string) => void;
	tabsRightNode?: ReactNode;
}>;

export const TabNavigation = ({
	className = "",
	items,
	value,
	defaultTab,
	onChange,
	children,
	label,
	tabsRightNode,
}: TabNavigationProps) => {
	return (
		<Tabs.Root
			value={value}
			defaultValue={defaultTab}
			onValueChange={onChange}
			className={className}
		>
			<HStack className="et-ml-0.5 et-h-9 et-items-center et-justify-between">
				<Tabs.List className="et-flex et-gap-4" aria-label={label}>
					{items.map((tab) => (
						<Tabs.Trigger
							className="et-w-[150px] et-border-b et-border-solid et-border-dark-purple et-py-1 et-font-mono et-text-base et-font-bold et-uppercase et-text-inactive-purple focus-visible:et-rounded-md focus-visible:et-border-slate-700 focus-visible:et-outline focus-visible:et-outline-acc-purple aria-selected:et-border-acc-purple aria-selected:et-text-white"
							key={tab.id}
							value={tab.id}
						>
							{tab.label}
						</Tabs.Trigger>
					))}
				</Tabs.List>
				{tabsRightNode}
			</HStack>
			{children}
		</Tabs.Root>
	);
};
