import { useSelector } from 'react-redux';
import * as React from 'react';
import { useAppDispatch, setAsSucceed, RootState } from './store';
import { CheckForm } from './components/CheckForm';
import { useState } from 'react';

function App() {
	const { all } = useSelector((state: RootState) => state);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [error, setError] = useState('');

	const dispatch = useAppDispatch();

	const handleCheck = (value: string) => {
		const areEqual = all[currentIndex]['Search text'] === value;

		if (!areEqual) {
			setError('Wrong translation!');
			return;
		}

		dispatch(setAsSucceed(currentIndex));
		setCurrentIndex((index) => ++index);
	};

	return (
		<div className="App">
			Переведите слово: {all[currentIndex]['Search text']}
			<CheckForm onCheck={handleCheck} />
			{error}
		</div>
	);
}

export default App;
