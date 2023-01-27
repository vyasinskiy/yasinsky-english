import { MapRusKeyToEngKeys } from '../assets/types';

export function getRandomDigit(excludeDigit: number, maxIndex: number): number {
	let randomDigit = getRandom() * getRandom();

	while (!isAcceptedDigit(randomDigit, excludeDigit, maxIndex)) {
		randomDigit = getRandom() * getRandom();
	}

	return randomDigit;
}

function getRandom(): number {
	return +(Math.random() * 10).toFixed(0);
}

function isAcceptedDigit(
	digit: number,
	excludeDigit: number,
	maxIndex: number
) {
	return digit >= 30 || digit === excludeDigit || digit > maxIndex;
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
