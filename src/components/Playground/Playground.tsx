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

import cn from 'classnames';

import {
	useAppDispatch,
	setAsSucceed,
	setAsFavorite,
	RootState,
} from '../../store';

import { saveProgressToLocalStorage } from '../../hooks/helpers';
import { useWord } from '../../hooks/useWord';

import { ReactComponent as FavoriteIcon } from '../../assets/icons/favorite.svg';
import styles from './Playground.module.scss';

export function Playground() {
	const dispatch = useAppDispatch();
	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);
	const { succeed, favorite } = useSelector((state: RootState) => state);

	useEffect(() => {
		saveProgressToLocalStorage(succeed, favorite);
	}, [succeed]);

	const { currentWord, updateWord, checkWord } = useWord();

	const { engKey, rusKey, engContext, rusContext, isFavorite } = currentWord;

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

		const { isCorrectAnswer, isPartiallyCorrect, isSynonym } = checkResult;

		if (isCorrectAnswer) {
			setIsSnackBarOpen(true);
			onReset();
			setSynonymsSelected([]);

			dispatch(setAsSucceed({ rusKey, engKey: value }));
			for (const synonym of synonymsSelected) {
				dispatch(setAsSucceed({ rusKey, engKey: synonym }));
			}
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

			return;
		}

		setError('Wrong translation!');
	};

	const handleAddToFavorite = () =>
		dispatch(setAsFavorite({ rusKey, engKey }));

	const onNext = () => {
		for (const synonym of synonymsSelected) {
			dispatch(setAsSucceed({ rusKey, engKey: synonym }));
		}
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
			<h1 className={styles.title}>
				<Tooltip
					placement="top"
					className={styles.tooltip}
					title={
						<span className={styles.exampleText}>{rusContext}</span>
					}
				>
					<span>{rusKey[0].toUpperCase() + rusKey.slice(1)}</span>
				</Tooltip>
				<FavoriteIcon
					className={cn(styles.favoriteIcon, {
						[styles.active]: isFavorite,
					})}
					onClick={handleAddToFavorite}
				/>
			</h1>

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
