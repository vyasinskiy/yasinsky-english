import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

interface ProviderProps {
	children: ReactNode;
}

export const Provider: FC<ProviderProps> = ({ children }) => {
	return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
