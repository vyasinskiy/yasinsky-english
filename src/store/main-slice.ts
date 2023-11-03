import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mapRusKeyToSynonyms } from '../assets';
import {
	MapRusKeyToEngKeys,
	MapRusKeyToSynonyms,
	Mode,
	SynonymData,
} from '../assets/types';
import { getModeFromLocalStorage, resetProgressFromLocalStorage, setModeToLocalStorage } from '../hooks/helpers';

interface MainState {
	all: MapRusKeyToSynonyms;
	favorite: MapRusKeyToEngKeys;
	isGameFinished: boolean;
	mode: Mode;
	succeed: MapRusKeyToEngKeys;
	todo: MapRusKeyToSynonyms;
}

const initalState: MainState = {
	all: mapRusKeyToSynonyms,
	favorite: {},
	isGameFinished: false,
	mode: Mode.Ordinary,
	succeed: {},
	todo: {},
};

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

function getFavoriteTodo(favorite: MapRusKeyToEngKeys) {
	const advancedData = {} as MapRusKeyToSynonyms;

	for (const [rusKey, engFavoriteValues] of Object.entries(favorite)) {
		if (engFavoriteValues.length === 0) {
			continue;
		}

		if (!mapRusKeyToSynonyms[rusKey]) {
			continue;
		}

		const engSynonyms = engFavoriteValues.reduce((acc, value) => {
			const engSynonyms = mapRusKeyToSynonyms[rusKey];
			if (!engSynonyms) {
				return acc;
			}

			const engSynonym = engSynonyms.find(
				(engSynonym) => engSynonym.engKey === value
			);

			if (engSynonym) {
				return [...acc, engSynonym];
			}

			return acc;
		}, [] as SynonymData[]);

		advancedData[rusKey] = engSynonyms;
	}

	return advancedData;
}

function getOrdinaryTodo(succeed: MainState['succeed']) {
	return Object.keys(mapRusKeyToSynonyms).reduce((acc, rusKey) => {
		const rusKeySucceedData = succeed[rusKey];
		const synonymsData = mapRusKeyToSynonyms[rusKey];

		if (rusKeySucceedData && rusKeySucceedData.length > 0) {
			const todoSynonyms = synonymsData.filter(
				(synonymData) =>
					!rusKeySucceedData.includes(synonymData.engKey)
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
}

const getTranslationData = (key: string) => {
	const data = localStorage.getItem(key);

	if (!data) {
		return {};
	}

	const parsed = JSON.parse(data);
	return isTranslationsData(parsed) ? parsed : {};
}

const lazyInitialize = (): MainState => {
	const state: MainState = initalState;
	state.succeed = getTranslationData('translations-succed');
	state.favorite = getTranslationData('translations-favorite');
	state.mode = getModeFromLocalStorage();

	if (state.mode === Mode.Favorite) {
		state.todo = getFavoriteTodo(state.favorite);
	} else {
		state.todo = getOrdinaryTodo(state.succeed);
	}

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
			let engKeys = state.favorite[rusKey];

			if (!engKeys) {
				state.favorite[rusKey] = [];
				engKeys = state.favorite[rusKey];
			}

			const engKeyIndex = engKeys.findIndex((item) => item === engKey);

			if (engKeyIndex === -1) {
				engKeys.push(engKey);
			} else {
				if (engKeys.length > 1) {
					state.favorite[rusKey].splice(engKeyIndex, 1);
				} else {
					delete state.favorite[rusKey];
				}
			}
		},
		setAsSucceed(
			state,
			action: PayloadAction<{ rusKey: string; engKey: string }>
		) {
			const { rusKey, engKey } = action.payload;

			const engKeys = state.todo[rusKey];

			if (!engKeys) {
				return;
			}

			const reducedToDoSynonyms = engKeys.filter(
				(todo) => todo.engKey !== engKey
			);

			if (reducedToDoSynonyms.length === 0) {
				delete state.todo[rusKey];
			} else {
				state.todo[rusKey] = reducedToDoSynonyms;
			}

			const isGameFinished = Object.keys(state.todo).length === 0;
			state.isGameFinished = isGameFinished;

			if (state.mode === Mode.Favorite) {
				return;
			}

			const isSucceedRusKeyExists = state.succeed[rusKey];

			if (!isSucceedRusKeyExists) {
				state.succeed[rusKey] = [];
			}

			const isEngKeyAlreadySucceed =
				state.succeed[rusKey].includes(engKey);

			if (!isEngKeyAlreadySucceed) {
				state.succeed[rusKey].push(engKey);
			}
		},
		resetProgress(state) {
			state = initalState;
			resetProgressFromLocalStorage('translations-succed');
		},
		changeMode(state, action: PayloadAction<{ mode: Mode }>) {
			setModeToLocalStorage(action.payload.mode);
			state.mode = action.payload.mode;
		}
	},
});

export const { setAsSucceed, setAsFavorite, setIsGameFinished, resetProgress, changeMode } =
	mainSlice.actions;
export default mainSlice.reducer;
