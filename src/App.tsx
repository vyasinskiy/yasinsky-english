import * as React from 'react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, setAsSucceed, RootState } from './store';
import { Button, TextField } from '@mui/material';

import styles from './App.module.scss';

function App() {
	const dispatch = useAppDispatch();
	const [currentIndex, setCurrentIndex] = useState(0);

	const [value, setValue] = useState('');
	const [error, setError] = useState('');

	const { all } = useSelector((state: RootState) => state);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const areEqual = all[currentIndex]['Search text'] === value;

		if (!areEqual) {
			setError('Wrong translation!');
			return;
		}

		dispatch(setAsSucceed(currentIndex));
		setCurrentIndex((index) => ++index);
	};

	const taskWord = all[currentIndex]['Translation text'];

	return (
		<div className={styles.wrapper}>
			<h1>{taskWord[0].toUpperCase() + taskWord.slice(1)}</h1>

			<form onSubmit={handleSubmit}>
				<TextField
					className={styles.verticalShift}
					color="primary"
					onChange={onChange}
					value={value}
					fullWidth={true}
					label="Type your answer"
					variant="outlined"
					error={Boolean(error)}
					helperText={error}
				/>
				<Button
					className={styles.verticalShift}
					variant="contained"
					fullWidth={true}
					type="submit"
				>
					Answer
				</Button>
			</form>
		</div>
	);
}

export default App;
