import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { createEvent } from "../event-system/create-event";
import { EventBus } from "../event-system/event-bus";
import { useConsumeEvents } from "../event-system/use-consume-events";

type TestEventParamShape = { test: string };
enum Events {
	TEST = "TEST",
}

beforeEach(() => {
	EventBus.reset(); // clear EventBus after each test run to allow independent tests
});

describe("useConsumeEvent", () => {
	it("correctly receives an update", async () => {
		// createEvent
		const { 2: useManageEvent, 4: usePublisher } = createEvent<TestEventParamShape>(
			Events.TEST,
		);
		expect(EventBus.getEventListenerMap()[Events.TEST]).toBeDefined();

		// render the consumer with the listeners and publishers for Events.TEST
		// each listener/publisher of the event has a data-test-id attribute with their name
		// when a new listener/publisher is added, it will render the corresponding element
		// making it available in the dom to check
		function Consumer() {
			const { listenerMap, publisherMap } = useConsumeEvents();
			return (
				<div data-test-id="consumer">
					{listenerMap[Events.TEST].map((listener) => (
						<span data-test-id={listener.identifier}>
							{listener.identifier}
						</span>
					))}
					{publisherMap[Events.TEST].map((publisher) => (
						<span data-test-id={publisher.identifier}>
							{publisher.identifier}
						</span>
					))}
				</div>
			);
		}

		render(<Consumer />);
		expect(await screen.queryByTestId("consumer")).toBeDefined();
		expect(await screen.queryByTestId("TestComponent")).toBeNull();

		function TestComponent() {
			usePublisher("TestComponent");
			return <div>Component that signs up as a publisher</div>;
		}
		render(<TestComponent />);

		expect(await screen.queryByTestId("TestComponent")).toBeDefined();
		expect(await screen.queryByTestId("TestComponentTwo")).toBeNull();

		function TestComponentTwo() {
			useManageEvent("TestComponentTwo", () => {});
			return <div>Component that uses useManageEvent</div>;
		}

		render(<TestComponentTwo />);

		expect(await screen.queryByTestId("TestComponentTwo")).toBeDefined();
	});
});
