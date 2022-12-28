import * as React from 'react';
import { useState, useLayoutEffect, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

import { useAppDispatch, setAsSucceed, RootState } from './store';
import { synonymsMap } from './assets/initTranslations';

import styles from './App.module.scss';
import { getRandomXXX } from './hooks/helpers';

function App() {
	const dispatch = useAppDispatch();

	const [currentIndex, setCurrentIndex] = useState<number>(getRandomXXX());
	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);

	const { all, succeed } = useSelector((state: RootState) => state);

	const rusKey = all[currentIndex]['Translation text'];
	const engKey = all[currentIndex]['Search text'];
	const helpText = all[currentIndex]['Search example'];

	useLayoutEffect(() => {
		const isAlreadySucceed =
			succeed[rusKey] && succeed[rusKey].includes(engKey);

		if (isAlreadySucceed) {
			setCurrentIndex(getRandomXXX());
		}
	}, [currentIndex]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isCorrectAnswer = value === engKey;
		const isSynonym = synonymsMap[rusKey].includes(value);

		if (!isCorrectAnswer && !isSynonym) {
			setError('Wrong translation!');
			return;
		}

		if (!isCorrectAnswer && isSynonym) {
			if (synonymsSelected.includes(value)) {
				return;
			}

			setError('Is synonym!');
			setSynonymsSelected((synonyms) => [...synonyms, value]);
			return;
		}

		dispatch(setAsSucceed(currentIndex));
		next();
	};

	const next = () => {
		setValue('');
		setError('');
		setCurrentIndex((index) => ++index);
		setSynonymsSelected([]);
		setShowHelp(false);
	};

	const onHelp = () => setShowHelp((showHelp) => !showHelp);

	return (
		<div className={styles.wrapper}>
			<h1>{rusKey[0].toUpperCase() + rusKey.slice(1)}</h1>

			<form onSubmit={handleSubmit}>
				<TextField
					autoFocus={true}
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
				<div className={styles.helpButtons}>
					<Button
						className={styles.verticalShift}
						variant="outlined"
						fullWidth={true}
						onClick={onHelp}
					>
						Help
					</Button>
					<Button
						className={styles.verticalShift}
						variant="outlined"
						fullWidth={true}
						onClick={next}
					>
						Skip
					</Button>
				</div>
			</form>

			<div className={styles.verticalShift}>{showHelp && helpText}</div>

			<ul>
				{synonymsSelected.map((synonym) => (
					<li key={synonym}>{synonym}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
