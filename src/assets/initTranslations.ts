import { Word } from '../store';
import json from './translations.json';

interface SynonymsMap {
	[key: string]: string[];
}

export const translations = json.filter(
	(translation) => translation['Search language'] === 'en'
) as Word[];

export const synonymsMap: SynonymsMap = translations.reduce((map, item) => {
	const rusKey = item['Translation text'];
	const engKey = item['Search text'];

	if (!rusKey || !engKey) {
		return map;
	}

	const rusLowerCaseKey = rusKey.toLowerCase();
	const engLowerCaseKey = engKey.toLowerCase();

	if (
		map[rusLowerCaseKey] &&
		!map[rusLowerCaseKey].includes(engLowerCaseKey)
	) {
		map[rusLowerCaseKey].push(engLowerCaseKey);
		return map;
	} else {
		map[rusLowerCaseKey] = [engLowerCaseKey];
		return map;
	}
}, {} as SynonymsMap);
