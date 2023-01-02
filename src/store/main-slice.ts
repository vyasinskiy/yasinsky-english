import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { translations } from '../assets';
import { SuccedTranslations, Word } from '../assets/types';

interface MainState {
	all: Word[];
	succeed: SuccedTranslations;
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
			console.log(action.type, action.payload);
			const succedWord = state.all[action.payload];
			const rusKey = succedWord['Translation text'];
			const engKey = succedWord['Search text'];

			const hasSucceedSynonyms = state.succeed[rusKey];
			if (hasSucceedSynonyms) {
				state.succeed[rusKey].push(engKey);
			} else {
				state.succeed[rusKey] = [engKey];
			}

			const filtredAll = state.all.filter(
				(_, index) => index !== action.payload
			);
			state.all = filtredAll;
		},
	},
});

export const { setAsSucceed } = mainSlice.actions;
export default mainSlice.reducer;
