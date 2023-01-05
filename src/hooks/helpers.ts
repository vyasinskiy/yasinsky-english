import { MapRusKeyToEngKeys } from '../assets/types';

export function getRandomXXX(excludeDigit: number, maxIndex: number): number {
	console.log('Getting random...');
	const randomDigit = getRandomDigit() * getRandomDigit();

	if (
		randomDigit !== 0 &&
		randomDigit < 30 &&
		randomDigit !== excludeDigit &&
		randomDigit < maxIndex
	) {
		return randomDigit;
	}

	return getRandomXXX(excludeDigit, maxIndex);
}

function getRandomDigit(): number {
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
