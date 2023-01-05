import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mapRusKeyToSynonyms } from '../assets';
import { MapRusKeyToEngKeys, MapRusKeyToSynonyms } from '../assets/types';

interface MainState {
	all: MapRusKeyToSynonyms;
	todo: MapRusKeyToSynonyms;
	succeed: MapRusKeyToEngKeys;
}

function isSuccedData(data: unknown): data is MapRusKeyToEngKeys {
	return (
		!!data &&
		typeof data === 'object' &&
		Object.values(data).every(
			(value) =>
				Array.isArray(value) &&
				value.every((arrayItem) => typeof arrayItem === 'string')
		)
	);
}

const emptyState: MainState = {
	all: mapRusKeyToSynonyms,
	todo: mapRusKeyToSynonyms,
	succeed: {},
};

const lazyInitialize = (): MainState => {
	const localStorageData = localStorage.getItem('succed-translations');

	if (!localStorageData) {
		return emptyState;
	}

	const succeed = JSON.parse(localStorageData);

	if (!isSuccedData(succeed)) {
		return emptyState;
	}

	const todo = Object.keys(mapRusKeyToSynonyms).reduce((acc, rusKey) => {
		const rusKeySucceedData = succeed[rusKey];
		const synonymsData = mapRusKeyToSynonyms[rusKey];

		if (rusKeySucceedData && rusKeySucceedData.length > 0) {
			const todoSynonyms = synonymsData.filter(
				(synonymData) => !rusKeySucceedData.includes(synonymData.engKey)
			);

			if (todoSynonyms.length === 0) {
				return acc;
			} else {
				return {
					...acc,
					[rusKey]: todoSynonyms,
				};
			}
		} else {
			return {
				...acc,
				[rusKey]: synonymsData,
			};
		}
	}, {});

	return {
		all: mapRusKeyToSynonyms,
		todo: todo,
		succeed: succeed,
	};
};

const mainSlice = createSlice({
	name: 'main',
	initialState: lazyInitialize,
	reducers: {
		setAsSucceed(
			state,
			action: PayloadAction<{ rusKey: string; engKey: string }>
		) {
			console.log(action.type, action.payload);
			const { rusKey, engKey } = action.payload;

			const isRusKeyExists = state.succeed[rusKey];

			if (!isRusKeyExists) {
				state.succeed[rusKey] = [];
			}

			const isEngKeyAlreadySucceed =
				state.succeed[rusKey].includes(engKey);

			if (!isEngKeyAlreadySucceed) {
				state.succeed[rusKey].push(engKey);

				const reducedToDoSynonyms = state.todo[rusKey].filter(
					(todo) => todo.engKey !== engKey
				);

				if (reducedToDoSynonyms.length === 0) {
					console.log('state.todo[rusKey]', state.todo[rusKey]);
					console.log(
						'No synonyms left, deleting rusKey from state.todo....'
					);
					delete state.todo[rusKey];
				} else {
					console.log('state.todo[rusKey]', state.todo[rusKey]);
					console.log('reducedToDoSynonyms', reducedToDoSynonyms);
					console.log('Synonyms decreased, setting newRusKeyData...');
					state.todo[rusKey] = reducedToDoSynonyms;
				}
			}
		},
	},
});

export const { setAsSucceed } = mainSlice.actions;
export default mainSlice.reducer;
