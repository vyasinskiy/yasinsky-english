import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mapRusKeyToSynonyms } from '../assets';
import { MapRusKeyToEngKeys, MapRusKeyToSynonyms } from '../assets/types';

interface MainState {
	all: MapRusKeyToSynonyms;
	todo: MapRusKeyToSynonyms;
	succeed: MapRusKeyToEngKeys;
	favorite: MapRusKeyToEngKeys;
	isGameFinished: boolean;
}

function isTranslationsData(data: unknown): data is MapRusKeyToEngKeys {
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

const lazyInitialize = (): MainState => {
	const state: MainState = {
		all: mapRusKeyToSynonyms,
		todo: {},
		succeed: {},
		favorite: {},
		isGameFinished: false,
	};

	const succeedData = localStorage.getItem('succed-translations');

	if (succeedData) {
		const succeed = JSON.parse(succeedData);
		state.succeed = isTranslationsData(succeed) ? succeed : {};
	}

	const favoriteData = localStorage.getItem('favorite-translations');

	if (favoriteData) {
		const favorite = JSON.parse(favoriteData);
		state.favorite = isTranslationsData(favorite) ? favorite : {};
	}

	const todo = Object.keys(mapRusKeyToSynonyms).reduce((acc, rusKey) => {
		const rusKeySucceedData = state.succeed[rusKey];
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

	state.todo = todo;

	state.isGameFinished = Object.keys(state.todo).length === 0;

	return state;
};

const mainSlice = createSlice({
	name: 'main',
	initialState: lazyInitialize,
	reducers: {
		setIsGameFinished(
			state,
			action: PayloadAction<{ isFinished: boolean }>
		) {
			state.isGameFinished = action.payload.isFinished;
		},
		setAsFavorite(
			state,
			action: PayloadAction<{ rusKey: string; engKey: string }>
		) {
			const { rusKey, engKey } = action.payload;
			const isRusKeyExists = state.favorite[rusKey];

			if (!isRusKeyExists) {
				state.favorite[rusKey] = [];
			}

			const isEngKeyAlreadyFavorite =
				state.favorite[rusKey].includes(engKey);

			if (!isEngKeyAlreadyFavorite) {
				state.favorite[rusKey].push(engKey);
			}
		},
		setAsSucceed(
			state,
			action: PayloadAction<{ rusKey: string; engKey: string }>
		) {
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
					delete state.todo[rusKey];
				} else {
					state.todo[rusKey] = reducedToDoSynonyms;
				}
			}

			const isGameFinished = Object.keys(state.todo).length === 0;
			if (isGameFinished) {
				setIsGameFinished({ isFinished: true });
			}
		},
	},
});

export const { setAsSucceed, setAsFavorite, setIsGameFinished } =
	mainSlice.actions;
export default mainSlice.reducer;
