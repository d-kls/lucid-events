import { MutableRefObject } from "react";

export function saveSvg(ref: MutableRefObject<HTMLDivElement | null>, name: string) {
	const parent = ref.current;
	if (!parent) return;
	const svgEl = parent.firstElementChild as SVGElement;
	if (!svgEl) return;

	svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	const svgData = svgEl.outerHTML;
	const preface = '<?xml version="1.0" standalone="no"?>\r\n';
	const svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
	const svgUrl = URL.createObjectURL(svgBlob);
	const downloadLink = document.createElement("a");

	downloadLink.href = svgUrl;
	downloadLink.download = `${name}.svg`;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
