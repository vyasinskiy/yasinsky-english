import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateIndex } from './useUpdateIndex';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { saveProgressToLocalStorage } from './helpers';
import { useIsFirstRender } from './useIsFirstRender';

export const useWord = () => {
	const { todo, all, succeed, favorite } = useSelector(
		(state: RootState) => state
	);

	const isFirst = useIsFirstRender();

	const { currentIndex, updateIndex } = useUpdateIndex();

	const updateWord = () => {
		const maxIndex = Object.keys(todo).length;
		updateIndex(maxIndex - 1);
	};

	const currentWord = useMemo(() => {
		const rusKey = Object.keys(todo).sort()[currentIndex];
		const engKey = todo[rusKey][0].engKey;

		const isFavorite = Boolean(
			favorite[rusKey] && favorite[rusKey].includes(engKey)
		);

		return {
			rusKey: rusKey,
			engKey: engKey,
			engContext: todo[rusKey][0].engContext,
			rusContext: todo[rusKey][0].rusContext,
			isFavorite: isFavorite,
			isLast: Object.keys(todo).length === 1,
		};
	}, [favorite, currentIndex]);

	useEffect(() => {
		if (isFirst) {
			return;
		}

		const isCurrentWordDone = Boolean(
			!todo[currentWord.rusKey] ||
				todo[currentWord.rusKey].findIndex(
					(synonym) => synonym.engKey === currentWord.engKey
				) === -1
		);

		if (!isCurrentWordDone) {
			return;
		}

		updateWord();
	}, [todo]);

	const checkWord = (value: string) => {
		if (!currentWord) {
			return;
		}

		return {
			isCorrectAnswer: value === currentWord.engKey,
			isPartiallyCorrect: currentWord.engKey.includes(value),
			isSynonym: Boolean(
				all[currentWord.rusKey]?.find((item) => item.engKey === value)
			),
		};
	};

	const prevWord = useRef<typeof currentWord>();

	useLayoutEffect(() => {
		if (isFirst || !prevWord.current || !currentWord) {
			return;
		}

		if (prevWord.current.engKey === currentWord.engKey) {
			updateWord();
			prevWord.current = currentWord;
		}
	}, [currentIndex]);

	useEffect(() => {
		if (isFirst) {
			return;
		}

		saveProgressToLocalStorage(succeed, favorite);
	}, [succeed, favorite]);

	return { currentWord, updateWord, checkWord };
};
