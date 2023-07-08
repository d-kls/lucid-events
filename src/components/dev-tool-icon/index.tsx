import { GearIcon } from "@radix-ui/react-icons";
import { AllHTMLAttributes, forwardRef } from "react";

type DevToolIconProps = Pick<AllHTMLAttributes<HTMLElement>, "onClick">;

export const DevToolIcon = forwardRef<HTMLButtonElement, DevToolIconProps>(
	({ onClick, ...rest }, ref) => {
		return (
			<button
				ref={ref}
				className="et-fixed et-bottom-5 et-left-5 et-z-[99998] et-grid et-h-20 et-w-20 et-cursor-pointer et-place-items-center et-rounded-full et-border et-border-solid et-border-purple-300 et-bg-light-purple et-text-acc-purple et-shadow-2xl et-shadow-neutral-600 hover:et-border-acc-purple focus-visible:et-border-purple-900 focus-visible:et-outline-none"
				onClick={onClick}
				{...rest}
			>
				<GearIcon className="et-h-16 et-w-16" />
			</button>
		);
	},
);
