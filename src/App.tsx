import * as React from 'react';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import {
	Button,
	Divider,
	List,
	ListItem,
	Snackbar,
	TextField,
	Tooltip,
} from '@mui/material';

import {
	useAppDispatch,
	setAsSucceed,
	setAsFavorite,
	RootState,
} from './store';

import styles from './App.module.scss';
import { saveProgressToLocalStorage } from './hooks/helpers';
import { useWord } from './hooks/useWord';

function App() {
	const dispatch = useAppDispatch();
	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);
	const { todo, succeed, favorite } = useSelector(
		(state: RootState) => state
	);

	useEffect(() => {
		saveProgressToLocalStorage(succeed, favorite);
	}, [succeed]);

	useEffect(() => {
		if (Object.keys(todo).length === 0) {
			return;
		}

		updateWord();
	}, [todo]);

	const { currentWord, updateWord, checkWord } = useWord();

	if (!currentWord) {
		return 'Game finished';
	}

	const { engKey, rusKey, engContext, rusContext } = currentWord;

	const isFavorite = favorite[rusKey] && favorite[rusKey].includes(engKey);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (value === '') {
			return;
		}

		const checkResult = checkWord(value);

		if (!checkResult) {
			return;
		}

		const {
			isCorrectAnswer,
			isPartiallyCorrect,
			synonym: { isSynonym, isSynonymAlreadySucceed },
		} = checkResult;

		if (isCorrectAnswer) {
			setIsSnackBarOpen(true);
			dispatch(setAsSucceed({ rusKey, engKey: value }));
			onReset();
			return;
		}

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		if (isSynonym) {
			setValue('');
			setError('Synonym! Try another one!');

			const isSynonymAlreadySelected = synonymsSelected.includes(value);

			if (!isSynonymAlreadySelected) {
				setSynonymsSelected((synonyms) => [...synonyms, value]);
			}

			if (!isSynonymAlreadySucceed) {
				setIsSnackBarOpen(true);
				dispatch(setAsSucceed({ rusKey, engKey: value }));
			}
			return;
		}

		setError('Wrong translation!');
	};

	const handleAddToFavorite = () =>
		dispatch(setAsFavorite({ rusKey, engKey }));

	const onNext = () => {
		onReset();
		updateWord();
	};

	const onReset = () => {
		setValue('');
		setError('');
		setSynonymsSelected([]);
		setShowHelp(false);
	};

	const onHelp = () => setShowHelp(true);

	return (
		<div className={styles.wrapper}>
			<Tooltip
				placement="top"
				className={styles.tooltip}
				title={<span className={styles.exampleText}>{rusContext}</span>}
			>
				<h1>{rusKey[0].toUpperCase() + rusKey.slice(1)}</h1>
			</Tooltip>

			<form onSubmit={handleSubmit}>
				<TextField
					autoFocus={true}
					autoComplete="off"
					className={styles.verticalShift}
					color="primary"
					onChange={onChange}
					value={value}
					fullWidth={true}
					label="Type your answer"
					variant="outlined"
					error={Boolean(error)}
					helperText={error}
					disabled={showHelp}
				/>
				<Button
					className={styles.verticalShift}
					variant="contained"
					fullWidth={true}
					type="submit"
					disabled={showHelp}
				>
					Answer
				</Button>
				<div className={styles.helpButtons}>
					<Button
						className={styles.verticalShift}
						variant="outlined"
						fullWidth={true}
						onClick={onHelp}
						disabled={showHelp}
					>
						Help
					</Button>
					<Button
						className={styles.verticalShift}
						variant="outlined"
						fullWidth={true}
						onClick={onNext}
					>
						{showHelp ? 'Next' : 'Skip'}
					</Button>
				</div>
				<Button
					variant="outlined"
					fullWidth={true}
					onClick={handleAddToFavorite}
					disabled={isFavorite}
				>
					Add to favorite
				</Button>
			</form>

			<List className={styles.synonyms}>
				{synonymsSelected.map((synonym) => (
					<React.Fragment key={synonym}>
						<ListItem>{synonym}</ListItem>
						<Divider />
					</React.Fragment>
				))}
			</List>

			{showHelp && (
				<Tooltip
					className={styles.tooltip}
					title={
						<span className={styles.exampleText}>{engContext}</span>
					}
				>
					<span className={styles.help}>{engKey}</span>
				</Tooltip>
			)}
			<Snackbar
				open={isSnackBarOpen}
				onClose={() => setIsSnackBarOpen(false)}
				autoHideDuration={2000}
				message={`Succeed words: ${Object.keys(succeed).length}`}
			/>
		</div>
	);
}

export default App;
