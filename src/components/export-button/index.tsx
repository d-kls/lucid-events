import { DownloadIcon } from "@radix-ui/react-icons";

export const ExportButton = ({
	className = "",
	onClick,
}: {
	onClick: () => void;
	className?: string;
}) => (
	<div
		className={`ExportButton et-mb-2.5 et-grid et-h-7 et-w-7 et-place-items-center et-rounded et-bg-acc-purple et-font-sans et-font-medium et-text-dark-purple hover:et-bg-purple-600 ${className}`}
		onClick={onClick}
	>
		<DownloadIcon className="et-text-dark-purple" />
	</div>
);
