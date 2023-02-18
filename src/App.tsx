import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Playground } from './components/Playground/Playground';

import './index.scss';

function App() {
	const { isGameFinished } = useSelector((state: RootState) => state);

	return isGameFinished ? 'Game finished' : <Playground />;
}

export default App;
