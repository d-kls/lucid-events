import { ExtendedListenerWithIdentifier } from "../event-bus";
import { notify } from "../flows-update-pipe";
import {Tracer as ProdTracer} from "../prod"

type Span = {
	event: string;
	sender: string;
	receivers: ExtendedListenerWithIdentifier[];
};
export type Trace = Span[];
type TraceMap = { [key: string]: Trace };

export class EventTracer {
	private static traceMap: TraceMap = {};

	static getTraceMap() {
		return EventTracer.traceMap;
	}
}

export class Tracer {
	private name: string;
	private trace: Trace;
	private activeSpansCount: number;

	constructor(name: string) {
		this.name = name;
		this.trace = [];
		this.activeSpansCount = 0;
	}

	static create(name: string): Tracer {
		return new Tracer(name);
	}

	async init(
		callback: () =>
			| [string, string, ExtendedListenerWithIdentifier[]]
			| Promise<[string, string, ExtendedListenerWithIdentifier[]]>,
	) {
		this.trace = [];
		this.activeSpansCount++;
		const [event, sender, receivers] = await callback();
		this.trace.push({ event, sender, receivers });
		this.activeSpansCount--;

		if (!this.activeSpansCount) {
			EventTracer.getTraceMap()[this.name] = this.trace;
			notify();
		}
	}

	async step(
		callback: () =>
			| [string, string, ExtendedListenerWithIdentifier[]]
			| Promise<[string, string, ExtendedListenerWithIdentifier[]]>,
	) {
		// if a step is part of multiple traces, only count the step for the trace that is active
		if (!this.activeSpansCount) return;

		this.activeSpansCount++;
		const [event, sender, receivers] = await callback();
		this.trace.push({ event, sender, receivers });
		this.activeSpansCount--;

		// might happen if the execution of steps is different where a partOf
		// step is async while the others are not, causing the publish event
		// of an async callback to be called after the synchronous init function executes.
		if (!this.activeSpansCount) {
			EventTracer.getTraceMap()[this.name] = this.trace;
			notify();
		}
	}
}

// allow part of steps to be associated with multiple tracers
export function ts(tracers: (Tracer | ProdTracer)[]) {
	return {
		step: async (
			callback: () =>
				| [string, string, ExtendedListenerWithIdentifier[]]
				| Promise<[string, string, ExtendedListenerWithIdentifier[]]>,
		) => {
			for (const tracer of tracers) {
				await tracer.step(callback);
			}
		},
	};
}
