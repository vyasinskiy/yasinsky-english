import { MapRusKeyToEngKeys } from '../assets/types';

export function getRandomInt(maxIndex: number, excludeInt?: number): number {
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

function isAcceptedDigit(digit: number, maxIndex: number, excludeInt?: number) {
	return digit <= 30 && digit <= maxIndex && digit !== excludeInt;
}

export function saveProgressToLocalStorage(
	succed: MapRusKeyToEngKeys,
	favorite: MapRusKeyToEngKeys
) {
	localStorage.setItem('succed-translations', JSON.stringify(succed));
	localStorage.setItem('favorite-translations', JSON.stringify(favorite));
}

export function getProgressFromLocalStorage() {
	const localStorageData = localStorage.getItem('succed-translations');

	if (!localStorageData) {
		return {};
	}

	return JSON.parse(localStorageData);
}
