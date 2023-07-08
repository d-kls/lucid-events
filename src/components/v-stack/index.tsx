import { AllHTMLAttributes } from "react";

type VStackProps = AllHTMLAttributes<HTMLDivElement>;

export const VStack = ({ className = "", ...rest }: VStackProps) => {
	return <div className={`et-flex et-flex-col ${className}`} {...rest}></div>;
};
