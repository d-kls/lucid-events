import { ExtendedListenerWithIdentifier } from "../event-bus";
import { throwIf } from "../../util/throw-if";
import { v4 } from "uuid";
import { useEffect } from "react";
import {
	ErrorMessage,
	ManageEventMountHook,
	PublishFn,
	PublishMountHook,
	PublishWithIdentifierFn,
	RegisterAsPublisherFn,
	SimpleManageEventMountHook,
	SimplePublishFn,
	SimplePublishMountHook,
	SimplePublishWithIdentifierFn,
	SimpleRegisterAsPublisherFn,
	SimpleSubscribeFn,
	SubscribeFn,
} from "../create-event";

/**
 * production version of EventBus
 *
 *
 *
 */

type BareListener = (param?: any) => void;
type ExtendedListener = { id: string; listener: BareListener };
type EventListenerMap = {
	[key: string]: ExtendedListener[];
};

class EventBus {
	private static eventListenerMap: EventListenerMap = {};

	static initEvent(event: string) {
		throwIf(
			!!EventBus.eventListenerMap[event],
			`Event with name: ${event} already exists`,
		);
		EventBus.eventListenerMap[event] = [];
	}

	static addListener(event: string, listener: BareListener) {
		const id = v4();
		const extended = { id, listener };
		EventBus.eventListenerMap[event].push(extended);
		return () => EventBus.removeListener(event, extended);
	}

	private static removeListener(event: string, listener: ExtendedListener) {
		EventBus.eventListenerMap[event] = EventBus.eventListenerMap[event].filter(
			({ id }) => id !== listener.id,
		);
	}

	static notify(event: string, param: any) {
		EventBus.eventListenerMap[event].forEach(({ listener }) => listener(param));
	}

	static notifySimple(event: string) {
		EventBus.eventListenerMap[event].forEach(({ listener }) => listener());
	}
}

/**
 * production versions of createEvent and createSimpleEvent
 * ==> all logger functionality removed
 * ==> all publisher functionality removed
 *
 * === leave only event system interaction
 *
 *
 */

function createEvent<T = void>(
	event: string & (T extends void ? ErrorMessage : string),
): [
	SubscribeFn<T>,
	PublishFn<T>,
	ManageEventMountHook<T>,
	RegisterAsPublisherFn<T>,
	PublishMountHook<T>,
] {
	EventBus.initEvent(event);

	const subscribe: SubscribeFn<T> = (_, listener) => {
		const unsub = EventBus.addListener(event, listener);
		return unsub;
	};

	const useManageEvent: ManageEventMountHook<T> = (identifier, listener, element) => {
		useEffect(() => {
			const unsub = subscribe(identifier, listener, element);
			return unsub;
		}, []);
	};

	const publish: PublishFn<T> = (...params) => {
		EventBus.notify(event, params[0]);
	};

	const publishWithIdentifier: PublishWithIdentifierFn<T> =
		() =>
		(...params) => {
			EventBus.notify(event, params[0]);
			return ["", "", []];
		};

	const registerAsPublisher: RegisterAsPublisherFn<T> = (identifier) => {
		return [() => {}, publishWithIdentifier(identifier)];
	};

	const usePublisher: PublishMountHook<T> = (identifier) => {
		return publishWithIdentifier(identifier);
	};

	return [subscribe, publish, useManageEvent, registerAsPublisher, usePublisher];
}

function createSimpleEvent(
	event: string,
): [
	SimpleSubscribeFn,
	SimplePublishFn,
	SimpleManageEventMountHook,
	SimpleRegisterAsPublisherFn,
	SimplePublishMountHook,
] {
	EventBus.initEvent(event);

	const subscribe: SimpleSubscribeFn = (_, listener) => {
		const unsub = EventBus.addListener(event, listener);
		return unsub;
	};

	const useManageEvent: SimpleManageEventMountHook = (
		identifier,
		listener,
		element,
	) => {
		useEffect(() => {
			const unsub = subscribe(identifier, listener, element);
			return unsub;
		}, []);
	};

	const publish: SimplePublishFn = () => {
		EventBus.notifySimple(event);
	};

	const publishWithIdentifier: SimplePublishWithIdentifierFn = () => () => {
		EventBus.notifySimple(event);
		return ["", "", []];
	};

	const registerAsPublisher: SimpleRegisterAsPublisherFn = (identifier) => {
		return [() => {}, publishWithIdentifier(identifier)];
	};

	const usePublisher: SimplePublishMountHook = (identifier) => {
		return publishWithIdentifier(identifier);
	};

	return [subscribe, publish, useManageEvent, registerAsPublisher, usePublisher];
}

/**
 * production version of Tracer class
 * ==> remove all functionality
 * ==> only provide the interface so the calls still working during prod
 *
 * === each function called in code will just execute its callback during prod
 *
 *
 */

class Tracer {
	// @ts-ignore
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	static create(name: string): Tracer {
		return new Tracer(name);
	}

	init(
		callback: () =>
			| [string, string, ExtendedListenerWithIdentifier[]]
			| Promise<[string, string, ExtendedListenerWithIdentifier[]]>,
	) {
		callback();
	}

	step(
		callback: () =>
			| [string, string, ExtendedListenerWithIdentifier[]]
			| Promise<[string, string, ExtendedListenerWithIdentifier[]]>,
	) {
		callback();
	}
}

export { createEvent, createSimpleEvent, Tracer };
