import { createEvent } from "../event-system/create-event";

type TestShape = { test: string };
type TestShapeTwo = { testTwo: string };
type TestShapeThree = { testThree: string };
type TestShapeFour = { testFour: string };
const [_, pub, useManageTest, ___, usePublisher] = createEvent<TestShape>("TEST");
const [__, pubTwo, useManageTestTwo, , usePublisherTwo] =
	createEvent<TestShapeTwo>("TEST_2");
const [, pubThree, useManageTestThree, , usePublisherThree] =
	createEvent<TestShapeThree>("TEST_3");

const { 2: useManageTestFour, 4: usePublisherFour } =
	createEvent<TestShapeFour>("TEST_4");
export {
	pub,
	useManageTest,
	pubTwo,
	useManageTestTwo,
	usePublisher,
	pubThree,
	useManageTestThree,
	usePublisherTwo,
	usePublisherThree,
	useManageTestFour,
	usePublisherFour,
};
