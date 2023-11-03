import { MapRusKeyToEngKeys, Mode } from '../assets/types';

const MAX_CONSTRAINT_INT = 30;

export function getRandomInt(maxInt: number, excludeInt?: number) {
	if (maxInt === 0) {
		return 0;
	}

	let randomIndex = getRandom() * getRandom();

	while (!isAcceptableInteger(randomIndex, maxInt, excludeInt)) {
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

export function resetProgressFromLocalStorage() {
	localStorage.clear();
}

export function setModeToLocalStorage(mode: Mode) {
	localStorage.setItem('translations-mode', mode);
}

function isModeData(data: unknown): data is Mode {
	return !!data && (data === Mode.Ordinary || data === Mode.Favorite);
}

export function getModeFromLocalStorage(): Mode {
	const data = localStorage.getItem('translations-mode');

	if (!data) {
		return Mode.Ordinary;
	}

	return isModeData(data) ? data : Mode.Ordinary;
}
