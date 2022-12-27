import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { translations } from '../assets';

export interface Word {
	'Search language': string;
	'Translation language': string;
	'Search text': string;
	'Translation text': string;
	'Tags / Comments': string;
	'Search example': string;
	'Translation example': string;
	'Source text': string;
	'Document / URL': string;
}

interface MainState {
	all: Word[];
	succeed: SuccedTranslations;
}

interface SuccedTranslations {
	[key: Word['Translation text']]: Word[];
}

function isSuccedData(data: unknown): data is SuccedTranslations {
	return !!data && typeof data === 'object';
}

const emptyState: MainState = {
	all: translations,
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

	return {
		all: translations,
		succeed: succeed,
	};
};

const mainSlice = createSlice({
	name: 'main',
	initialState: lazyInitialize,
	reducers: {
		setAsSucceed(state, action: PayloadAction<number>) {
			const succedWord = state.all[action.payload];
			const rusKey = succedWord['Translation text'].toLowerCase();
			state.succeed[rusKey].push(succedWord);

			const filtredAll = state.all.filter(
				(_, index) => index !== action.payload
			);
			state.all = filtredAll;
		},
	},
});

export const { setAsSucceed } = mainSlice.actions;
export default mainSlice.reducer;
