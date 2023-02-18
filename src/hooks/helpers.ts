import { MapRusKeyToEngKeys } from '../assets/types';

const MAX_CONSTRAINT_INT = 30;

export function getRandomIndex(
	arrayLength: number,
	excludeIndex?: number
): number | undefined {
	if (arrayLength === 1 && excludeIndex === 0) {
		return;
	}

	let randomIndex = getRandom() * getRandom();

	while (!isAcceptableInteger(randomIndex, arrayLength - 1, excludeIndex)) {
		randomIndex = getRandom() * getRandom();
	}

	return randomIndex;
}

export function isAcceptableInteger(
	checkInt: number,
	maxInt: number,
	excludeInt?: number
) {
	return Boolean(
		checkInt !== excludeInt &&
			checkInt <= maxInt &&
			checkInt < MAX_CONSTRAINT_INT
	);
}

function getRandom(): number {
	// TODO: toFixed(0) never returns 0. At the end of the game it causes infinite loop
	return +(Math.random() * 10).toFixed(0);
}

export function saveProgressToLocalStorage(
	succed: MapRusKeyToEngKeys,
	favorite: MapRusKeyToEngKeys
) {
	localStorage.setItem('translations-succed', JSON.stringify(succed));
	localStorage.setItem('translations-favorite', JSON.stringify(favorite));
}

export function getProgressFromLocalStorage() {
	const localStorageData = localStorage.getItem('translations-succed');

	if (!localStorageData) {
		return {};
	}

	return JSON.parse(localStorageData);
}
