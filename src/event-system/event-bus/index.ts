import { MutableRefObject } from "react";
import { throwIf } from "../../util/throw-if";
import { v4 } from "uuid";
import { notify } from "../events-update-pipe";

export type ElementAccessor = MutableRefObject<HTMLElement | null> | string;
export type ListenerWithIdentifier = {
	identifier: string;
	listener: (param?: any) => void;
	element?: ElementAccessor;
};
export type ExtendedListenerWithIdentifier = ListenerWithIdentifier & { id: string };
type EventListenerMap = {
	[key: string]: ExtendedListenerWithIdentifier[];
};

export type Publisher = {
	identifier: string;
	element?: ElementAccessor;
};
export type ExtendedPublisher = Publisher & { id: string };
type PublisherMap = {
	[key: string]: ExtendedPublisher[];
};

export class EventBus {
	private static eventListenerMap: EventListenerMap = {};
	private static publisherMap: PublisherMap = {};

	static initEvent(event: string) {
		throwIf(
			!!EventBus.eventListenerMap[event],
			`Event with name: ${event} already exists`,
		);
		EventBus.eventListenerMap[event] = [];
		EventBus.publisherMap[event] = [];
	}

	static addListener(event: string, listener: ListenerWithIdentifier) {
		const id = v4();
		const extended = { id, ...listener };
		EventBus.eventListenerMap[event].push(extended);
		notify();
		return () => EventBus.removeListener(event, extended);
	}

	private static removeListener(
		event: string,
		listener: ExtendedListenerWithIdentifier,
	) {
		EventBus.eventListenerMap[event] = EventBus.eventListenerMap[event].filter(
			({ id }) => id !== listener.id,
		);
		notify();
	}

	static notify(event: string, param: any) {
		EventBus.eventListenerMap[event].forEach(({ listener }) => listener(param));
		notify();
	}

	static notifySimple(event: string) {
		EventBus.eventListenerMap[event].forEach(({ listener }) => listener());
		notify();
	}

	static getEventListenerMap() {
		return this.eventListenerMap;
	}

	static addPublisher(event: string, publisher: Publisher) {
		const id = v4();
		const extended = { id, ...publisher };
		EventBus.publisherMap[event].push(extended);
		notify();
		return () => EventBus.removePublisher(event, extended);
	}

	private static removePublisher(event: string, publisher: ExtendedPublisher) {
		EventBus.publisherMap[event] = EventBus.publisherMap[event].filter(
			({ id }) => id !== publisher.id,
		);
		notify();
	}

	static getPublisherMap() {
		return this.publisherMap;
	}

	static reset() {
		this.eventListenerMap = {};
	}
}
