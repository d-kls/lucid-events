import * as Tabs from "@radix-ui/react-tabs";
import { PropsWithChildren } from "react";

type TabsContentProps = PropsWithChildren<{ value: string; noPt?: boolean }>;

export const TabContent = ({ value, children, noPt }: TabsContentProps) => {
	const pt = !noPt ? "et-pt-6" : "";
	return (
		<Tabs.Content
			className={`et-flex-1 et-overflow-auto et-py-3 ${pt} focus-visible:et-outline focus-visible:et-outline-1 focus-visible:et-outline-acc-purple`}
			value={value}
		>
			{children}
		</Tabs.Content>
	);
};
