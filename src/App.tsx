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

import { useAppDispatch, setAsSucceed, RootState } from './store';

import styles from './App.module.scss';
import { saveProgressToLocalStorage } from './hooks/helpers';
import { useUpdateIndex } from './hooks/useUpdateIndex';

function App() {
	const dispatch = useAppDispatch();
	const { all, todo, succeed } = useSelector((state: RootState) => state);
	const [currentIndex, updateIndex] = useUpdateIndex();
	const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);

	console.log('=======logs=======');
	console.log('currentIndex', currentIndex);

	const rusKey = Object.keys(todo).sort()[currentIndex];
	const engKey = todo[rusKey][0].engKey;
	const example = todo[rusKey][0].example;

	console.log('rusKey', rusKey);
	console.log('engKey', engKey);

	console.log('succeed[rusKey]', succeed[rusKey]);
	console.log('todo[rusKey]', todo[rusKey]);

	useEffect(() => {
		console.log('saveProgressToLocalStorage');
		saveProgressToLocalStorage(succeed);
	}, [succeed]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		console.log('onChange');
		setValue(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		console.log('handleSubmit');
		event.preventDefault();

		const isCorrectAnswer = value === engKey;

		if (isCorrectAnswer) {
			setIsSnackBarOpen(true);
			dispatch(setAsSucceed({ rusKey, engKey: value }));
			onNext();
			return;
		}

		const isPartiallyCorrect = engKey.includes(value);

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		const isSynonym = all[rusKey].find((item) => item.engKey === value);

		if (isSynonym) {
			setValue('');
			setError('Synonym! Try another one!');

			const isSynonymAlreadySelected = synonymsSelected.includes(value);

			if (!isSynonymAlreadySelected) {
				setSynonymsSelected((synonyms) => [...synonyms, value]);
			}

			const isSynonymAlreadySucceed =
				succeed[rusKey] &&
				succeed[rusKey].find((engKey) => engKey === value);

			if (!isSynonymAlreadySucceed) {
				setIsSnackBarOpen(true);
				dispatch(setAsSucceed({ rusKey, engKey: value }));
			}
			return;
		}

		setError('Wrong translation!');
	};

	const onNext = () => {
		console.log('onNext');
		updateIndex(Object.keys(todo).length);
		setValue('');
		setError('');
		setSynonymsSelected([]);
		setShowHelp(false);
	};

	const onHelp = () => {
		console.log('onHelp');
		setShowHelp(true);
	};

	return (
		<div className={styles.wrapper}>
			<h1>{rusKey[0].toUpperCase() + rusKey.slice(1)}</h1>

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
						<span className={styles.exampleText}>{example}</span>
					}
				>
					<span className={styles.help}>{engKey}</span>
				</Tooltip>
			)}
			<Snackbar
				open={isSnackBarOpen}
				onClose={() => setIsSnackBarOpen(false)}
				autoHideDuration={2000}
				message={`Succeed words: ${Object.keys(succeed).length + 1}`}
			/>
		</div>
	);
}

export default App;
