import { useCallback, useState } from "react";

export function useForceUpdate() {
	const [_, setCount] = useState(0);

	return useCallback(() => setCount((prev) => prev + 1), []);
}
