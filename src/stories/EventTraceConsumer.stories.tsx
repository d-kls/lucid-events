import type { Meta, StoryObj } from "@storybook/react";

import { EventTraceConsumer } from "../components/event-trace-consumer";
import { useRef, useState } from "react";
import {
	useManageTest,
	useManageTestFour,
	useManageTestThree,
	useManageTestTwo,
	usePublisher,
	usePublisherFour,
	usePublisherThree,
	usePublisherTwo,
} from "./StorySetup";
import { Tracer, ts } from "../event-system/event-tracer";

const meta: Meta<typeof EventTraceConsumer> = {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: "Components/EventTraceConsumer",
	component: EventTraceConsumer,
};

export default meta;
type Story = StoryObj<typeof EventTraceConsumer>;

export const Standalone: Story = {
	render: () => {
		return (
			<div>
				<Title />
				<ButtonPublisher />
				<AnotherTitle />
				<AnotherButton />
				<TitleThree />
				<TitleFour />
				<EventTraceConsumer />
			</div>
		);
	},
};

const helloTracer = Tracer.create("Hello");
const soloTracer = Tracer.create("Solo");

const AnotherButton = () => {
	const pub = usePublisherFour("AnotherButton");

	return (
		<button
			className="et-bg-red-500"
			onClick={() => {
				soloTracer.init(
					() => pub({ testFour: "Hello World Two" }), //.begin("Solo");
				);
			}}
		>
			Click me to change the title
		</button>
	);
};

const Title = () => {
	const ref = useRef<HTMLHeadingElement | null>(null);
	const [title, setTitle] = useState("Lets begin?");
	const pub = usePublisherTwo("Title", ref);

	useManageTest("Title", ({ test }) => {
		setTitle(test);
		ts([helloTracer, soloTracer]).step(() => pub({ testTwo: "Chain Title" }));
	});

	return (
		<h1 ref={ref} data-test="test">
			{title}
		</h1>
	);
};

const TitleThree = () => {
	const ref = useRef<HTMLHeadingElement | null>(null);
	const [title, setTitle] = useState("Lets begin?");

	useManageTestThree("TitleThree", ({ testThree }) => {
		setTitle(testThree);
	});

	return (
		<h1 ref={ref} data-test="test">
			{title}
		</h1>
	);
};

const TitleFour = () => {
	const ref = useRef<HTMLHeadingElement | null>(null);
	const [title, setTitle] = useState("Lets begin?");

	useManageTestFour("TitleFour", ({ testFour }) => {
		setTitle(testFour);
	});

	return (
		<h1 ref={ref} data-test="test">
			{title}
		</h1>
	);
};

const ButtonPublisher = () => {
	const ref = useRef<HTMLButtonElement | null>(null);
	const pub = usePublisher("ButtonPublisher", ref);

	return (
		<button
			ref={ref}
			className="et-bg-teal-500"
			onClick={() => helloTracer.init(() => pub({ test: "Hello World" }))}
		>
			Click me to change the title
		</button>
	);
};

const AnotherTitle = () => {
	const [title, setTitle] = useState("Lets begin?");
	const pub = usePublisherThree("AnotherTitle");

	useManageTestTwo(
		"AnotherTitle",
		({ testTwo }) => {
			helloTracer.step(() => {
				setTitle(testTwo);
				return pub({ testThree: "Another Chain Title" });
			});
		},
		"[data-event-subscriber='another-title']",
	);

	return <h1 data-event-subscriber="another-title">{title}</h1>;
};
