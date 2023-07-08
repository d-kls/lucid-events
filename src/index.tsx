import "./index.css";
import * as Internal from "./components/event-trace-consumer";
import * as Dev from "./event-system/create-event";
import * as DevT from "./event-system/event-tracer";
import * as Prod from "./event-system/prod";
import { ReactElement } from "react";
import { isDevelopment } from "./util/is-development";

export const createEvent = !isDevelopment() ? Prod.createEvent : Dev.createEvent;

export const createSimpleEvent = !isDevelopment()
	? Prod.createSimpleEvent
	: Dev.createSimpleEvent;
export const Tracer = !isDevelopment() ? Prod.Tracer : DevT.Tracer;
export const EventTraceConsumer: () => ReactElement | null = !isDevelopment()
	? () => null
	: Internal.EventTraceConsumer;
export const ts = DevT.ts;
