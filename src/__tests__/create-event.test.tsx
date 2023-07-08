import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createEvent, createSimpleEvent } from "../event-system/create-event";
import { EventBus } from "../event-system/event-bus";

type TestEventParamShape = { test: string };
enum Events {
	TEST = "TEST",
	TEST_2 = "TEST-2",
	TEST_3 = "TEST-3",
	TEST_4 = "TEST-4",
	TEST_5 = "TEST-5",
}

beforeEach(() => {
	EventBus.reset(); // clear EventBus after each test run to allow independent tests
});

describe("create(Simple)Event", () => {
	it("adds an event if event name is not duplicated", () => {
		// createEvent
		createEvent<TestEventParamShape>(Events.TEST);
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeDefined();

		// createSimpleEvent
		createSimpleEvent(Events.TEST_2);
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toBeDefined();
	});

	it("throws an error if event name is duplicated", () => {
		// createEvent
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeUndefined();
		createEvent<TestEventParamShape>(Events.TEST);
		expect(() => createEvent<TestEventParamShape>(Events.TEST)).toThrowError(
			`Event with name: ${Events.TEST} already exists`,
		);

		// createSimpleEvent
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toBeUndefined();
		createSimpleEvent(Events.TEST_2);
		expect(() => createSimpleEvent(Events.TEST_2)).toThrowError(
			`Event with name: ${Events.TEST_2} already exists`,
		);
	});

	it("adds and removes listener correctly", () => {
		// createEvent
		const [sub] = createEvent<TestEventParamShape>(Events.TEST);
		const handler: (param: TestEventParamShape) => void = () => {};
		const unsub = sub("Handler", handler);
		expect(EventBus.getEventListenerMap()[Events.TEST]).toHaveLength(1);
		expect(EventBus.getEventListenerMap()[Events.TEST][0].identifier).toEqual(
			"Handler",
		);
		expect(EventBus.getEventListenerMap()[Events.TEST][0].listener).toEqual(handler);
		expect(EventBus.getEventListenerMap()[Events.TEST][0].element).toEqual(undefined);

		unsub();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toHaveLength(0);

		// createSimpleEvent
		const [subSimple] = createSimpleEvent(Events.TEST_2);
		const handlerSimple = () => {};
		const unsubSimple = subSimple("HandlerSimple", handlerSimple, "#root");
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toHaveLength(1);
		expect(EventBus.getEventListenerMap()[Events.TEST_2][0].identifier).toEqual(
			"HandlerSimple",
		);
		expect(EventBus.getEventListenerMap()[Events.TEST_2][0].listener).toEqual(
			handlerSimple,
		);
		expect(EventBus.getEventListenerMap()[Events.TEST_2][0].element).toEqual("#root");

		unsubSimple();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toHaveLength(0);
	});

	it("notifies - by using publish - correctly", () => {
		// createEvent
		const [sub, pub] = createEvent<TestEventParamShape>(Events.TEST);
		const handler = vi.fn<[testParams: TestEventParamShape], void>(() => {});
		const handler2 = vi.fn<[testParams: TestEventParamShape], void>(() => {});
		sub("Handler", handler);
		sub("Handler2", handler2);
		pub({ test: "test" });
		expect(handler.mock.calls.length).toBe(1);
		expect(handler2.mock.calls.length).toBe(1);
		expect(handler.mock.calls[0][0]).toEqual({ test: "test" });
		expect(handler2.mock.calls[0][0]).toEqual({ test: "test" });

		// createSimpleEvent
		const [subSimple, pubSimple] = createSimpleEvent(Events.TEST_2);
		const handlerSimple = vi.fn(() => {});
		const handlerSimple2 = vi.fn(() => {});
		subSimple("HandlerSimple", handlerSimple);
		subSimple("HandlerSimple2", handlerSimple2);
		pubSimple();
		expect(handlerSimple.mock.calls.length).toBe(1);
		expect(handlerSimple2.mock.calls.length).toBe(1);
		expect(handlerSimple.mock.calls[0]).toHaveLength(0);
		expect(handlerSimple2.mock.calls[0]).toHaveLength(0);
	});

	it("sends publish param as undefined if not set", () => {
		// createEvent
		const [sub, pub] = createEvent<TestEventParamShape | undefined>(Events.TEST);
		const handler = vi.fn<[testParams: TestEventParamShape | undefined], void>(
			() => {},
		);
		const handler2 = vi.fn<[testParams: TestEventParamShape | undefined], void>(
			() => {},
		);
		sub("Handler", handler);
		sub("Handler2", handler2);
		pub();
		expect(handler.mock.calls.length).toBe(1);
		expect(handler2.mock.calls.length).toBe(1);
		expect(handler.mock.calls[0][0]).toEqual(undefined);
		expect(handler2.mock.calls[0][0]).toEqual(undefined);
	});

	it("provides a useManageEvent hook that correctly subs and unsubs", () => {
		// createEvent
		const [_, pub, useManageEvent] = createEvent<TestEventParamShape>(Events.TEST);

		function TestComponent() {
			useManageEvent("TestComponent", (param) => {
				console.log(param);
			});
			return <div>Component that uses useManageEvent</div>;
		}

		const { unmount } = render(<TestComponent />);
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toHaveLength(1);

		pub({ test: "hello_world" });

		unmount();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toHaveLength(0);

		// createSimpleEvent
		const [__, pubS, useManageEventS] = createSimpleEvent(Events.TEST_2);
		function TestComponentSimple() {
			useManageEventS("TestComponentSimple", () => {});
			return <div>Component that uses useManageEvent</div>;
		}
		const { unmount: unmountSimple } = render(<TestComponentSimple />);
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toHaveLength(1);

		pubS();

		unmountSimple();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toHaveLength(0);
	});

	it("correctly adds and removes publisher names", () => {
		// createEvent
		const { 4: usePublisher } = createEvent<TestEventParamShape>(Events.TEST);

		function TestComponent() {
			usePublisher("TestComponent", "[data-test='test']");
			return <div data-test="test">Component that uses useManageEvent</div>;
		}

		const { unmount } = render(<TestComponent />);
		expect(EventBus.getPublisherMap()[Events.TEST]).toBeDefined();
		expect(EventBus.getPublisherMap()[Events.TEST]).toHaveLength(1);
		expect(EventBus.getPublisherMap()[Events.TEST][0].identifier).toEqual(
			"TestComponent",
		);
		expect(EventBus.getPublisherMap()[Events.TEST][0].element).toEqual(
			"[data-test='test']",
		);

		unmount();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST]).toHaveLength(0);

		// createSimpleEvent
		const { 1: pubS, 4: usePublisherS } = createSimpleEvent(Events.TEST_2);
		function TestComponentSimple() {
			usePublisherS("TestComponentSimple");

			return <div>Component that uses useManageEvent</div>;
		}
		const { unmount: unmountSimple } = render(<TestComponentSimple />);
		expect(EventBus.getPublisherMap()[Events.TEST_2]).toBeDefined();
		expect(EventBus.getPublisherMap()[Events.TEST_2]).toHaveLength(1);
		expect(EventBus.getPublisherMap()[Events.TEST_2][0].identifier).toEqual(
			"TestComponentSimple",
		);

		pubS();

		unmountSimple();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toBeDefined();
		expect(EventBus.getEventListenerMap()[Events.TEST_2]).toHaveLength(0);
	});
});

/**
 * Some TypeScript type tests
 */

// @ts-expect-error
createEvent(Events.TEST_3); // compiles with ts-expect-error comment === error is being thrown without generic

const [_, pub] = createEvent<TestEventParamShape>(Events.TEST_4);
// @ts-expect-error
pub(); // cannot call publish without parameter if undefined is not in type

const [__, _pub] = createEvent<TestEventParamShape | undefined>(Events.TEST_5);
_pub(); // can call publish without parameter if undefined is in type
