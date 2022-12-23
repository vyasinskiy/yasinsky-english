import { configureStore } from '../../node_modules/@reduxjs/toolkit/dist/configureStore';
import mainReducer from './main-slice';

export const store = configureStore({
	reducer: mainReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
