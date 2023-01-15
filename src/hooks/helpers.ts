import { MapRusKeyToEngKeys } from '../assets/types';

export function getRandomDigit(excludeDigit: number, maxIndex: number): number {
	const randomDigit = getRandom() * getRandom();

	if (
		randomDigit < 30 &&
		randomDigit !== excludeDigit &&
		randomDigit <= maxIndex
	) {
		return randomDigit;
	}

	return getRandomDigit(excludeDigit, maxIndex);
}

function getRandom(): number {
	return +(Math.random() * 10).toFixed(0);
}

export function saveProgressToLocalStorage(progress: MapRusKeyToEngKeys) {
	localStorage.setItem('succed-translations', JSON.stringify(progress));
}

export function getProgressFromLocalStorage() {
	const localStorageData = localStorage.getItem('succed-translations');

	if (!localStorageData) {
		return {};
	}

	return JSON.parse(localStorageData);
}
