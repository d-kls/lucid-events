import { Graphviz } from "@hpcc-js/wasm/graphviz";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";

type GraphvizLoaderProps = {
	setIsInitialized: Dispatch<SetStateAction<boolean>>;
};

export let gv: Graphviz | null = null;

export const GraphvizLoader = ({ setIsInitialized }: GraphvizLoaderProps) => {
	useLayoutEffect(() => {
		(async () => {
			gv = await Graphviz.load();
			if (gv) setIsInitialized(true);
		})();
	}, []);

	return (
		<div className="et-grid et-place-items-center">
			<div className="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
