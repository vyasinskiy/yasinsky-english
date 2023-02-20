import { getRandomInt, isAcceptableInteger } from './helpers';

describe('Testing getRandomInt', () => {
	test('it should always return 0 with maxInt === 0', () => {
		const maxInt = 0;
		expect(getRandomInt(maxInt)).toBe(0);
	});
	test('it should return undefined when maxInt === 1 and excludeInt === 1', () => {
		const maxInt = 1;
		const excludeInt = 1;
		expect(getRandomInt(maxInt, excludeInt)).toBeNaN();
	});
	test('it should avoid to return 0 every time if other positive index exists', () => {
		const maxInt = 1;
		expect(getRandomInt(maxInt)).toBe(1);
	});
	test('it should return 1 when maxInt === 2 and excludeInt === 2', () => {
		const maxInt = 2;
		const excludeInt = 2;
		expect(getRandomInt(maxInt, excludeInt)).toBe(1);
	});
	test('it should return 2 when maxInt === 2 and excludeInt === 1', () => {
		const maxInt = 2;
		const excludeInt = 1;
		expect(getRandomInt(maxInt, excludeInt)).toBe(2);
	});
	test('it should not return excludeInt', () => {
		const maxInt = 3;
		const excludeInt = 1;
		expect(getRandomInt(maxInt, excludeInt)).not.toBe(1);
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
	test('it should return true without exclude integer', () => {
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
