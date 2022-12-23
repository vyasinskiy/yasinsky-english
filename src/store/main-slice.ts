import { PayloadAction } from '../../node_modules/@reduxjs/toolkit/dist/createAction';
import { createSlice } from '../../node_modules/@reduxjs/toolkit/dist/createSlice';

type Lang = 'en' | 'ru';

interface Word {
	'Search language': Lang;
	'Translation language': Lang;
	'Search text': string;
	'Translation text': string;
	'Search example': string;
	'Translation example': string;
}

interface MainState {
	all: Word[];
	succeed: Word[];
	skipped: Word[];
}

function isMainState(data: unknown): data is MainState {
	return (
		!!data &&
		typeof data === 'object' &&
		'all' in data &&
		'succeed' in data &&
		'skipper' in data
	);
}

const emptyState: MainState = {
	all: [],
	succeed: [],
	skipped: [],
};

const lazyInitialize = (): MainState => {
	const localStorageItem = localStorage.getItem('translations');

	if (!localStorageItem) {
		return emptyState;
	}

	const storageData = JSON.parse(localStorageItem);

	if (!isMainState(storageData)) {
		return emptyState;
	}

	return storageData;
};

const mainSlice = createSlice({
	name: 'main',
	initialState: lazyInitialize(),
	reducers: {
		setAsSucceed(state, action: PayloadAction<Word>) {
			const filtredAll = state.all.filter(
				(word) => word['Search text'] !== action.payload['Search text']
			);
			state.all = filtredAll;

			const filtredSkipped = state.skipped.filter(
				(word) => word['Search text'] !== action.payload['Search text']
			);
			state.skipped = filtredSkipped;

			state.succeed.push(action.payload);
		},
	},
});

export const { setAsSucceed } = mainSlice.actions;
export default mainSlice.reducer;
