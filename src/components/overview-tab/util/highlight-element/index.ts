import { Dispatch, SetStateAction } from "react";
import { ElementAccessor } from "../../../../event-system/event-bus";

export function highlightElement(
	element: ElementAccessor,
	setDisabled: Dispatch<SetStateAction<boolean>>,
) {
	let el: HTMLElement | null = null;
	if (typeof element === "string") {
		el = document.querySelector(element) as HTMLElement;
	} else {
		el = element.current;
	}

	if (!el) return;
	highlightFinalElement(el, setDisabled);
}

function highlightFinalElement(
	el: HTMLElement,
	setDisabled: Dispatch<SetStateAction<boolean>>,
) {
	const OUTLINE = "2px solid #A64CFF";
	const FADE = "et-animate-fade";
	const TIMEOUT_DUR = 3000;

	const prev = el.style.outline;
	el.style.outline = OUTLINE;
	el.classList.add(FADE);

	setTimeout(() => {
		el.style.outline = prev;
		el.classList.remove(FADE);
		setDisabled(false);
	}, TIMEOUT_DUR);
}
