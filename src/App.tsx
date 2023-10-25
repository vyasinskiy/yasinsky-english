import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Playground } from './components/Playground/Playground';

import './index.scss';
import Dashboard from './components/Dashboard';

function App() {
	const isGameFinished = useSelector(
		(state: RootState) => state.isGameFinished
	);

	return (
		<Dashboard>
			{isGameFinished ?
				(<p>Game finished</p>) : 
				<Playground />
			}
		</Dashboard>
	);
}

export default App;
