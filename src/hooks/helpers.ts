import { MapRusKeyToEngKeys } from '../assets/types';

export function getRandomInt(
	maxIndex: number,
	excludeInt: number | null
): number {
	let randomInt = getRandom() * getRandom();

	while (!isAcceptedDigit(randomInt, maxIndex, excludeInt)) {
		randomInt = getRandom() * getRandom();
	}

	return randomInt;
}

function getRandom(): number {
	// TODO: toFixed(0) never returns 0. At the end of the game it causes infinite loop
	return +(Math.random() * 10).toFixed(0);
}

function isAcceptedDigit(
	digit: number,
	maxIndex: number,
	excludeInt: number | null
) {
	return digit <= 30 && digit <= maxIndex && digit !== excludeInt;
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
