import { ChevronRightIcon } from "@radix-ui/react-icons";

type ChevronWithNameProps = { name: string };

export const ChevronWithName = ({ name }: ChevronWithNameProps) => {
	return (
		<div className="et-flex et-items-center et-gap-3">
			<ChevronRightIcon className="AccordionChevron et-h-5 et-w-5 et-text-acc-purple" />
			<div>{name}</div>
		</div>
	);
};
