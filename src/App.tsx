import * as React from 'react';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, Tooltip } from '@mui/material';

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
	const example = all[currentIndex]['Search example'];

	useEffect(() => {
		saveProgressToLocalStorage(succeed);
	}, [succeed]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) =>
		setValue(event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isCorrectAnswer = value === engKey;

		if (isCorrectAnswer) {
			dispatch(setAsSucceed(currentIndex));
			onNext();
			return;
		}

		const isPartiallyCorrect = engKey.includes(value);

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		const synonymData = synonymsMap[rusKey].find(
			(synonymData) => synonymData.engKey === value
		);

		if (!synonymData || synonymsSelected.includes(value)) {
			setError('Wrong translation!');
			return;
		}

		setError('Synonym! Try another one!');
		setValue('');
		setSynonymsSelected((synonyms) => [...synonyms, value]);
		dispatch(setAsSucceed(synonymData.allIndex));
	};

	const onNext = () => {
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
						onClick={onNext}
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
			{showHelp && (
				<Tooltip
					className={styles.tooltip}
					title={
						<span className={styles.exampleText}>{example}</span>
					}
				>
					<span className={styles.help}>{engKey}</span>
				</Tooltip>
			)}
		</div>
	);
}

export default App;
