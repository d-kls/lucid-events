import { useEffect } from "react";

import { ElementAccessor, EventBus, ExtendedListenerWithIdentifier } from "../event-bus";
import { EventLogger } from "../event-logger";

export type ErrorMessage = "TypeError: You must provide a generic type to createEvent";
export type RegisterAsPublisherFn<T> = (
	identifier: string,
	element?: ElementAccessor,
) => [() => void, PublishFn<T>];
export type PublishMountHook<T> = (
	identifier: string,
	element?: ElementAccessor,
) => (...params: PublishParams<T>) => [string, string, ExtendedListenerWithIdentifier[]]; // Tracer;

export type UnsubscribeFn = () => void;
export type SubscribeFn<T> = (
	identifier: string,
	listener: (params: T) => void,
	element?: ElementAccessor,
) => UnsubscribeFn;
export type PublishParams<T> = T extends undefined ? [T?] : [T];
export type PublishFn<T> = (...params: PublishParams<T>) => void;
export type PublishWithIdentifierFn<T> = (
	identifier: string,
) => (...params: PublishParams<T>) => [string, string, ExtendedListenerWithIdentifier[]]; // Tracer;
export type ManageEventMountHook<T> = (
	identifier: string,
	listener: (params: T) => void,
	element?: ElementAccessor,
) => void;

export type SimpleSubscribeFn = (
	identifier: string,
	listener: () => void,
	element?: ElementAccessor,
) => UnsubscribeFn;
export type SimplePublishFn = () => void;
export type SimpleRegisterAsPublisherFn = (
	identifier: string,
	element?: ElementAccessor,
) => [() => void, SimplePublishFn];
export type SimplePublishMountHook = (
	identifier: string,
	element?: ElementAccessor,
) => () => [string, string, ExtendedListenerWithIdentifier[]];
export type SimplePublishWithIdentifierFn = (
	identifier: string,
) => () => [string, string, ExtendedListenerWithIdentifier[]];
export type SimpleManageEventMountHook = (
	identifier: string,
	listener: () => void,
	element?: ElementAccessor,
) => void;

/**
 *
 * used to create an event that might receive params. required to set generic manually in order to specify the shape/type of the
 * parameters the listener and publish functions receive and send.
 *
 * @param event unique name & identifier of the event. use enum for event keys for easier overview and maintance.
 * @returns tuple including the subscribe function, publish function and setup useEffect hook.
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

	const subscribe: SubscribeFn<T> = (identifier, listener, element) => {
		const unsub = EventBus.addListener(event, { identifier, listener, element });
		return unsub;
	};

	const useManageEvent: ManageEventMountHook<T> = (identifier, listener, element) => {
		useEffect(() => {
			const unsub = subscribe(identifier, listener, element);
			return unsub;
		}, []);
	};

	const publish: PublishFn<T> = (...params) => {
		const listeners = EventBus.getEventListenerMap()[event];
		EventLogger.addLog(event, "Unknown", listeners);
		EventBus.notify(event, params[0]);
	};

	const publishWithIdentifier: PublishWithIdentifierFn<T> =
		(identifier: string) =>
		(...params) => {
			const listeners = EventBus.getEventListenerMap()[event];
			EventLogger.addLog(event, identifier, listeners);
			EventBus.notify(event, params[0]);

			return [event, identifier, listeners];
		};

	const registerAsPublisher: RegisterAsPublisherFn<T> = (identifier, element) => {
		const unsub = EventBus.addPublisher(event, { identifier, element });
		return [unsub, publishWithIdentifier(identifier)];
	};

	const usePublisher: PublishMountHook<T> = (identifier, element) => {
		useEffect(() => {
			const [remove] = registerAsPublisher(identifier, element);
			return remove;
		}, []);

		return publishWithIdentifier(identifier);
	};

	return [subscribe, publish, useManageEvent, registerAsPublisher, usePublisher];
}

/**
 *
 * used to create an event without any params.
 *
 * @param event unique name & identifier of the event. use enum for event keys for easier overview and maintance.
 * @returns unique name & identifier of the event. use enum for event keys for easier overview and maintance.
 */
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

	const subscribe: SimpleSubscribeFn = (identifier, listener, element) => {
		const unsub = EventBus.addListener(event, { identifier, listener, element });
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
		const listeners = EventBus.getEventListenerMap()[event];
		EventLogger.addLog(event, "Unknown", listeners);
		EventBus.notifySimple(event);
	};

	const publishWithIdentifier: SimplePublishWithIdentifierFn =
		(identifier: string) => () => {
			const listeners = EventBus.getEventListenerMap()[event];
			EventLogger.addLog(event, identifier, listeners);
			EventBus.notifySimple(event);

			return [event, identifier, listeners];
		};

	const registerAsPublisher: SimpleRegisterAsPublisherFn = (identifier, element) => {
		const unsub = EventBus.addPublisher(event, { identifier, element });
		return [unsub, publishWithIdentifier(identifier)];
	};

	const usePublisher: SimplePublishMountHook = (identifier, element) => {
		useEffect(() => {
			const [remove] = registerAsPublisher(identifier, element);
			return remove;
		}, []);

		return publishWithIdentifier(identifier);
	};

	return [subscribe, publish, useManageEvent, registerAsPublisher, usePublisher];
}

export { createEvent, createSimpleEvent };
