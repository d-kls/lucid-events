import { Trace } from "../../../../event-system/event-tracer";
import { resolveBgColor, resolveTitle } from "../resolve-node-styles";

export const createGraphDef = (name: string, trace: Trace) => {
	const senders: Set<string> = new Set();
	const receivers: Set<string> = new Set();
	const nodes: string[] = trace.reduce<string[]>((acc, curr) => {
		acc.push(curr.sender);
		senders.add(curr.sender);
		curr.receivers.forEach((receiver) => {
			acc.push(receiver.identifier);
			receivers.add(receiver.identifier);
		});
		return acc;
	}, []);
	// make a set so all duplicate values are removed, then turn it back
	// to an array to have map method
	const nodeSet = [...new Set(nodes)];
	return `
		digraph ${name} {
			rankdir="LR"
			node [shape="none" fontname="Helvetica"];

			${nodeSet
				.map(
					(node) => `
				"${node}" [label=<
   				<table border="1" cellborder="0" cellspacing="1">
     			<tr><td align="left"><font point-size="8" color="${resolveBgColor(
					node,
					senders,
					receivers,
				)}">${resolveTitle(node, senders, receivers)}</font></td></tr>
     			<tr><td align="center"><b>${node}</b></td></tr>
				<tr><td align="center"></td></tr>
				<tr><td align="center"></td></tr>
   				</table>>]; \n\n\t\t\t
				`,
				)
				.join("")}

			${trace
				.map(
					(span) =>
						`"${span.sender}" -> {${span.receivers
							.map((receiver) => receiver.identifier)
							.join(";")}} [label=${span.event}] \n\t\t\t`,
				)
				.join("")}
		}
`;
};
