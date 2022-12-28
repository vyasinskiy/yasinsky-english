import { Word } from '../store';
import json from './translations.json';

function isWordsArray(json: unknown): json is Word[] {
	return (
		Array.isArray(json) &&
		json.every((item) => {
			return (
				'Search language' in item &&
				'Translation language' in item &&
				'Search text' in item &&
				'Translation text' in item &&
				'Search example' in item &&
				'Translation example' in item
			);
		})
	);
}

interface SynonymsMap {
	[key: string]: string[];
}

export const translations = isWordsArray(json)
	? json
			.filter((translation) => translation['Search language'] === 'en')
			.map((translation) => ({
				...translation,
				['Translation text']:
					translation['Translation text'].toLowerCase(),
				['Search text']: translation['Search text'].toLowerCase(),
			}))
	: [];

export const synonymsMap: SynonymsMap = translations.reduce((map, item) => {
	const rusKey = item['Translation text'];
	const engKey = item['Search text'];

	if (!rusKey || !engKey) {
		return map;
	}

	if (map[rusKey] && !map[rusKey].includes(engKey)) {
		map[rusKey].push(engKey);
		return map;
	} else {
		map[rusKey] = [engKey];
		return map;
	}
}, {} as SynonymsMap);
