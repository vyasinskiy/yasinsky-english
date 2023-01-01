import { SuccedTranslations } from '../assets/types';

export function getRandomXXX(excludeDigit?: number): number {
	const randomDigit = getRandomDigit() * getRandomDigit() * getRandomDigit();

	if (randomDigit !== excludeDigit) {
		return randomDigit;
	}

	return getRandomXXX(excludeDigit);
}

function getRandomDigit(): number {
	return +(Math.random() * 10).toFixed(0);
}

export function saveProgressToLocalStorage(progress: SuccedTranslations) {
	localStorage.setItem('succed-translations', JSON.stringify(progress));
}

export function getProgressFromLocalStorage() {
	const localStorageData = localStorage.getItem('succed-translations');

	if (!localStorageData) {
		return {};
	}

	return JSON.parse(localStorageData);
}
