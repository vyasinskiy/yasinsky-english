import * as React from 'react';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

import { useAppDispatch, setAsSucceed, RootState } from './store';
import { synonymsMap } from './assets/initTranslations';

import styles from './App.module.scss';
import { saveProgressToLocalStorage } from './hooks/helpers';
import { useUpdateIndex } from './hooks/useUpdateIndex';

function App() {
	const dispatch = useAppDispatch();

	const [currentIndex, updateIndex] = useUpdateIndex();

	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);

	const { all, succeed } = useSelector((state: RootState) => state);

	const rusKey = all[currentIndex]['Translation text'];
	const engKey = all[currentIndex]['Search text'];

	useEffect(() => {
		saveProgressToLocalStorage(succeed);
	}, [succeed]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isCorrectAnswer = value === engKey;
		const isPartiallyCorrect = !isCorrectAnswer && engKey.includes(value);
		const isSynonym =
			!isCorrectAnswer && synonymsMap[rusKey].includes(value);

		if (!isCorrectAnswer && !isPartiallyCorrect && !isSynonym) {
			setError('Wrong translation!');
			return;
		}

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		if (isSynonym) {
			if (synonymsSelected.includes(value)) {
				return;
			}

			setError('Synonym! Try another one!');
			setValue('');
			setSynonymsSelected((synonyms) => [...synonyms, value]);
			// TODO: setAsSucceed(synonym);
			return;
		}

		dispatch(setAsSucceed(currentIndex));
		next();
	};

	const next = () => {
		updateIndex();
		setValue('');
		setError('');
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

			<ul>
				{synonymsSelected.map((synonym) => (
					<li key={synonym}>{synonym}</li>
				))}
			</ul>

			<h3 className={styles.verticalShift}>{showHelp && engKey}</h3>
		</div>
	);
}

export default App;
