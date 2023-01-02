import json from './translations.json';
import { SynonymsMap, Word } from './types';

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

export const synonymsMap: SynonymsMap = translations.reduce(
	(map, item, index) => {
		const rusKey = item['Translation text'];
		const engKey = item['Search text'];

		if (!rusKey || !engKey) {
			return map;
		}

		const newSynonymItem = {
			engKey: engKey,
			allIndex: index,
		};

		const synonymsArray = map[rusKey];

		if (!synonymsArray) {
			map[rusKey] = [newSynonymItem];
			return map;
		}

		const isSynonymsArrayIncludesSynonym = Boolean(
			synonymsArray.find((item) => item.engKey === engKey)
		);

		if (isSynonymsArrayIncludesSynonym) {
			return map;
		}

		map[rusKey].push(newSynonymItem);
		return map;
	},
	{} as SynonymsMap
);
