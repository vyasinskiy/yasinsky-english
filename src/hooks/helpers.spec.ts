import { getRandomIndex, isAcceptableInteger } from './helpers';

describe('Testing getRandomIndex', () => {
	test('it should return undefined with array length === 0', () => {
		const arrayLength = 0;
		expect(getRandomIndex(arrayLength)).not.toBeDefined();
	});
	test('it should return 0 when array length === 1', () => {
		const arrayLength = 1;
		expect(getRandomIndex(arrayLength)).toBe(0);
	});
	test('it should return 0 when array length === 1', () => {
		const arrayLength = 1;
		const excludeInt = 0;
		expect(getRandomIndex(arrayLength, excludeInt)).toBe(0);
	});
	test('it should return 0 when array length === 1', () => {
		const arrayLength = 1;
		const excludeInt = 1;
		expect(getRandomIndex(arrayLength, excludeInt)).toBe(0);
	});
	test('it should return 1 when array length === 2', () => {
		const arrayLength = 2;
		const excludeInt = 1;
		expect(getRandomIndex(arrayLength, excludeInt)).toBe(1);
	});
	test('it should return 1 when array length === 3 and exclude digit === 2', () => {
		const arrayLength = 3;
		const excludeInt = 2;
		expect(getRandomIndex(arrayLength, excludeInt)).toBe(1);
	});
	test('it should return 2 when array length === 3 and exclude digit === 1', () => {
		const arrayLength = 3;
		const excludeInt = 1;
		expect(getRandomIndex(arrayLength, excludeInt)).toBe(2);
	});
	test('it should not return exclude digit', () => {
		const arrayLength = 3;
		const excludeInt = 1;
		expect(getRandomIndex(arrayLength, excludeInt)).not.toBe(1);
	});
});

describe('Testing isAcceptedInteger', () => {
	test('it should return false when checkInt > maxInt', () => {
		const checkInt = 1;
		const maxInt = 0;
		expect(isAcceptableInteger(checkInt, maxInt)).toBeFalsy();
	});
	test('it should return false when checkInt is equal to exclude integer', () => {
		const checkInt = 1;
		const maxInt = 10;
		const excludeInt = 1;
		expect(isAcceptableInteger(checkInt, maxInt, excludeInt)).toBeFalsy();
	});
	test('it should return true without exclude integet', () => {
		const checkInt = 1;
		const maxInt = 10;
		expect(isAcceptableInteger(checkInt, maxInt)).toBeTruthy();
	});
	test('it should return true', () => {
		const checkInt = 1;
		const maxInt = 5;
		const excludeInt = 3;
		expect(isAcceptableInteger(checkInt, maxInt, excludeInt)).toBeTruthy();
	});
});
