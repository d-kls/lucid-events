import { AllHTMLAttributes } from "react";

type HStackProps = AllHTMLAttributes<HTMLDivElement>;

export const HStack = ({ className = "", ...rest }: HStackProps) => {
	return <div className={`et-flex ${className}`} {...rest}></div>;
};
