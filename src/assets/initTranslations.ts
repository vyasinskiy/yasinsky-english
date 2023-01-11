import json from './translations.json';
import { MapRusKeyToSynonyms, Word } from './types';

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

export const mapRusKeyToSynonyms: MapRusKeyToSynonyms = translations.reduce(
	(map, item) => {
		const rusKey = item['Translation text'];
		const engKey = item['Search text'];
		const engContext = item['Search example'];
		const rusContext = item['Translation example'];

		if (!rusKey || !engKey) {
			return map;
		}

		if (!map[rusKey]) {
			map[rusKey] = [{ engKey, engContext, rusContext }];
		} else {
			map[rusKey] = [...map[rusKey], { engKey, engContext, rusContext }];
		}

		return map;
	},
	{} as MapRusKeyToSynonyms
);
