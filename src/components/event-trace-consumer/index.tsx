import { PropsWithChildren, forwardRef, useState } from "react";
import { DevToolIcon } from "../dev-tool-icon";
import * as Popover from "@radix-ui/react-popover";
import { EventTraceTabNavigation } from "../event-trace-tab-navigation";

export const EventTraceConsumer = () => {
	const [open, setOpen] = useState(false);
	// perhaps add after the BT
	const [expanded] = useState(false);

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<DevToolIcon />
			</Popover.Trigger>
			<PopoverAnchor />
			<Popover.Portal>
				<PopoverContentWrapper expanded={expanded}>
					<EventTraceTabNavigation
					// expanded={expanded}
					// setExpanded={setExpanded}
					/>
				</PopoverContentWrapper>
			</Popover.Portal>
		</Popover.Root>
	);
};

const PopoverAnchor = () => {
	return (
		<Popover.Anchor asChild>
			<div className="et-fixed et-bottom-0" />
		</Popover.Anchor>
	);
};

const PopoverContentWrapper = forwardRef<
	HTMLDivElement,
	PropsWithChildren<{ expanded: boolean }>
>(({ children, expanded }, ref) => {
	const expandCss = expanded ? "et-h-screen" : "et-h-[400px]";
	return (
		<Popover.Content
			ref={ref}
			className={`et-z-[99999] et-w-screen et-animate-slideIn et-rounded-tl-xl et-rounded-tr-xl et-bg-dark-purple et-px-8 et-pt-4 et-shadow-lg-up et-shadow-slate-300 ${expandCss} et-flex et-flex-col et-overflow-hidden`}
			onInteractOutside={(e) => e.preventDefault()}
		>
			{children}
		</Popover.Content>
	);
});
